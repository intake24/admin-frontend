/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyStaffModal", ["AdminUsersService", "ModalService", "UserStateService", directiveFun]);
};

function directiveFun(AdminUsersService, ModalService, UserStateService) {

    function controller(scope, element, attribute) {

        scope.userName = "";
        scope.password = "";
        scope.name = "";
        scope.email = "";
        scope.phone = "";
        scope.emailNotifications = true;
        scope.smsNotifications = true;
        scope.uiSelect = {
            availableUsers: [],
            selectedUsers: []
        };

        scope.passwordEdit = false;
        scope.selectExistingUser = true;

        scope.loading = false;

        scope.formValidation = {
            password: true,
            email: true
        };

        scope.findUsers = function (query) {
            AdminUsersService.find(query).then(function (data) {
                scope.uiSelect.availableUsers = data.map(function (user) {
                    return {
                        id: user.id,
                        name: user.name[0],
                        email: user.email[0],
                        phone: user.phone[0],
                        getTitle: function () {
                            var parts = [];
                            if (this.name) {
                                parts.push(this.name);
                            }
                            if (this.email) {
                                parts.push(this.email);
                            }
                            return parts.join(", ");
                        }
                    }
                });
            });
        };

        scope.switchPasswordView = function (bool) {
            scope.passwordEdit = bool;
        };

        scope.switchSelectUser = function (bool) {
            scope.selectExistingUser = bool;
        };

        scope.cancel = function () {
            scope.isOpen = false;
        };

        scope.save = function () {
            if (!formIsValid(scope)) {
                return;
            }
            scope.loading = true;
            getRequest(scope, AdminUsersService).finally(function () {
                scope.loading = false;
            });
        };

        scope.withdrawAccess = function () {
            var reqData = {
                users: [{
                    userId: scope.user.id,
                    role: scope.surveyId + "/staff"
                }]
            };
            scope.loading = true;
            AdminUsersService.withdrawUsersAccessToSurvey(scope.surveyId, reqData).then(function () {
                scope.onCreated();
                scope.isOpen = false;
            }).finally(function () {
                scope.loading = false;
            });
        };

        scope.deleteUser = function () {
            if (!confirm("Are you sure you want to delete this user?")) {
                return;
            }
            scope.loading = true;
            AdminUsersService.deleteUser(scope.user.id).then(function () {
                scope.isOpen = false;
                scope.onDeleted();
            }).finally(function () {
                scope.loading = false;
            });
        };

        scope.getIsEditable = function () {
            return UserStateService.getUserInfo().isSuperUser();
        };

        scope.$watch("isOpen", function (newVal) {
            var modalId = "surveyStaffModal";
            if (newVal) {
                ModalService.showArbitraryModal(modalId);
            } else {
                scope.selectExistingUser = true;
                ModalService.hideArbitraryModal(modalId);
            }
            updateScope(scope, scope.user);
        });

    }

    return {
        restrict: "E",
        scope: {
            surveyId: "=?",
            isOpen: "=?",
            user: "=?",
            onSaved: "&",
            onCreated: "=?",
            onDeleted: "=?"
        },
        link: controller,
        template: require("./survey-staff-modal.directive.html")
    }

}

function updateScope(scope, user) {
    if (user != null) {
        scope.userName = user.userName;
        scope.password = user.password;
        scope.name = user.name;
        scope.email = user.email;
        scope.phone = user.phone;
        scope.emailNotifications = user.emailNotifications;
        scope.smsNotifications = user.smsNotifications;
    } else {
        scope.userName = "";
        scope.password = "";
        scope.name = "";
        scope.email = "";
        scope.phone = "";
        scope.emailNotifications = true;
        scope.smsNotifications = true;
    }
}

function updateUser(scope) {
    scope.user.userName = scope.userName;
    scope.user.name = scope.name;
    scope.user.email = scope.email;
    scope.user.phone = scope.phone;
}

function formIsValid(scope) {
    if (scope.selectExistingUser) {
        return true;
    }
    scope.formValidation.email = scope.email && scope.email.trim() != "";
    if (scope.user && scope.passwordEdit || !scope.user) {
        scope.formValidation.password = scope.password && scope.password.trim() != "";
    }
    return scope.formValidation.email && scope.formValidation.password;
}

function getRequest(scope, AdminUsersService) {
    var serviceReq, reqData;
    if (scope.selectExistingUser) {
        reqData = {
            users: scope.uiSelect.selectedUsers.map(function (user) {
                return {
                    userId: user.id,
                    role: scope.surveyId + "/staff"
                };
            })
        };
        serviceReq = AdminUsersService.giveUsersAccessToSurvey(scope.surveyId, reqData).then(function () {
            scope.onCreated();
            scope.isOpen = false;
        });
    } else if (scope.user && scope.passwordEdit) {
        reqData = {
            userName: scope.user.userName,
            password: scope.password
        };
        serviceReq = AdminUsersService.patchUserPassword(scope.user.id, scope.password).then(function () {
            scope.isOpen = false;
        });
    } else if (scope.user && !scope.passwordEdit) {
        reqData = {
            userName: scope.user.userName,
            name: scope.name,
            surveyId: scope.surveyId,
            email: scope.email,
            phone: scope.phone,
            emailNotifications: scope.emailNotifications,
            smsNotifications: scope.smsNotifications,
            roles: scope.user.roles
        };
        serviceReq = AdminUsersService.patchUser(scope.user.id, reqData).then(function () {
            scope.isOpen = false;
            updateUser(scope);
            scope.onSaved(reqData);
        });
    } else {
        reqData = {
            password: scope.password,
            name: scope.name,
            email: scope.email,
            phone: scope.phone,
            roles: [scope.surveyId + "/staff"],
        };
        serviceReq = AdminUsersService.createUser(reqData).then(function (data) {
            scope.isOpen = false;
            scope.onCreated(reqData);
        });
    }
    return serviceReq.then(function () {
        return reqData;
    });
}
