/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyRespondentModal", ["AdminUsersService", "ModalService", directiveFun]);
};

function directiveFun(AdminUsersService, ModalService) {

    function controller(scope, element, attribute) {

        scope.userName = "";
        scope.password = "";
        scope.name = "";
        scope.email = "";
        scope.phone = "";
        scope.emailNotifications = true;
        scope.smsNotifications = true;

        scope.passwordEdit = false;

        scope.loading = false;

        scope.formValidation = {
            password: true,
            userName: true
        };

        scope.switchPasswordView = function (bool) {
            scope.passwordEdit = bool;
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

        scope.$watch("isOpen", function (newVal) {
            var modalId = "surveyRespondentModal";
            if (newVal) {
                ModalService.showArbitraryModal(modalId);
            } else {
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
        template: require("./survey-respondent-modal.directive.html")
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
    scope.formValidation.userName = scope.userName && scope.userName.trim() != "";
    if (scope.user && scope.passwordEdit || !scope.user) {
        scope.formValidation.password = scope.password && scope.password.trim() != "";
    }
    return scope.formValidation.userName && scope.formValidation.password;
}

function getRequest(scope, AdminUsersService) {
    var serviceReq, reqData;
    if (scope.user && scope.passwordEdit) {
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
            userName: scope.userName,
            password: scope.password,
            name: scope.name,
            surveyId: scope.surveyId,
            email: scope.email,
            phone: scope.phone
        };
        serviceReq = AdminUsersService.createOrUpdateRespondent(reqData).then(function (id) {
            scope.isOpen = false;
            reqData.id = id;
            scope.onCreated(reqData);
        });
    }
    return serviceReq.then(function () {
        return reqData;
    });
}
