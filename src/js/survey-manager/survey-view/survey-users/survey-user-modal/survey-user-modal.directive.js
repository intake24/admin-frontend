/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

var userTypes = require("../survey-users-types")(),
    USER_TYPE_STAFF = userTypes.USER_TYPE_STAFF,
    USER_TYPE_RESPONDENT = userTypes.USER_TYPE_RESPONDENT;

module.exports = function (app) {
    app.directive("surveyUserModal", ["AdminUsersService", "ModalService", directiveFun]);
};

function directiveFun(AdminUsersService, ModalService) {

    function controller(scope, element, attribute) {

        scope.userName = "";
        scope.password = "";
        scope.name = "";
        scope.email = "";
        scope.phone = "";

        scope.passwordEdit = false;

        scope.loading = false;

        scope.formValidation = {
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
            getRequest(scope, AdminUsersService).then(function (reqData) {
                updateUser(scope);
                scope.onSaved(reqData);
            }).finally(function () {
                scope.loading = false;
            });
        };

        scope.$watch("isOpen", function (newVal) {
            var modalId = "surveyUserModal";
            if (newVal) {
                ModalService.showArbitraryModal(modalId);
            } else {
                ModalService.hideArbitraryModal(modalId);
            }
            updateScope(scope, scope.user);
        })

    }

    return {
        restrict: "E",
        scope: {
            surveyId: "=?",
            isOpen: "=?",
            user: "=?",
            userType: "=?",
            onSaved: "&"
        },
        link: controller,
        template: require("./survey-user-modal.directive.html")
    }

}

function updateScope(scope, user) {
    if (user != null) {
        scope.userName = user.userName;
        scope.password = user.password;
        scope.name = user.name;
        scope.email = user.email;
        scope.phone = user.phone;
    } else {
        scope.userName = "";
        scope.password = "";
        scope.name = "";
        scope.email = "";
        scope.phone = "";
    }
}

function updateUser(scope) {
    if (scope.user == null) {
        scope.user = {};
    }
    scope.user.userName = scope.userName;
    scope.user.name = scope.name;
    scope.user.email = scope.email;
    scope.user.phone = scope.phone;
}

function formIsValid(scope) {
    scope.formValidation.userName = scope.userName.trim() != "";
    return scope.formValidation.userName;
}

function getRequest(scope, AdminUsersService) {
    var serviceReq, reqData;
    if (scope.user && scope.passwordEdit) {
        reqData = {
            userName: scope.user.userName,
            password: scope.password
        };
        serviceReq = AdminUsersService.patchUserPassword(scope.user.id, scope.password);
    } else if (scope.user && !scope.passwordEdit) {
        reqData = {
            userName: scope.user.userName,
            name: scope.name,
            surveyId: scope.surveyId,
            email: scope.email,
            phone: scope.phone,
            roles: scope.user.roles
        };
        serviceReq = AdminUsersService.patchUser(scope.user.id, reqData);
    } else if (scope.userType == USER_TYPE_STAFF) {
        reqData = {
            userName: scope.userName,
            password: scope.password,
            name: scope.name,
            surveyId: scope.surveyId,
            email: scope.email,
            phone: scope.phone
        };
        serviceReq = AdminUsersService.createOrUpdateSurveyStaff(reqData);
    } else if (scope.userType == USER_TYPE_RESPONDENT) {
        reqData = {
            userName: scope.userName,
            password: scope.password,
            name: scope.name,
            surveyId: scope.surveyId,
            email: scope.email,
            phone: scope.phone
        };
        serviceReq = AdminUsersService.createOrUpdateRespondent(reqData);
    }
    return serviceReq.then(function () {
        return reqData;
    });
}
