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
            var userReq = getRequest(scope);
            scope.loading = true;
            getRequest(scope, AdminUsersService).then(function () {
                scope.onSaved(userReq);
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

function formIsValid(scope) {
    scope.formValidation.userName = scope.user ? scope.user.userName : scope.newUserName;
    return scope.formValidation.userName;
}

function getRequest(scope, AdminUsersService) {
    if (scope.user && scope.passwordEdit) {
        return AdminUsersService.patchUserPassword({
            userName: scope.user.userName,
            password: scope.password
        });
    } else if (scope.user && !scope.passwordEdit) {
        return AdminUsersService.patchUser({
            userName: scope.user.userName,
            name: scope.name,
            surveyId: scope.surveyId,
            email: scope.email,
            phone: scope.phone
        });
    } else if (scope.userType == USER_TYPE_STAFF) {
        return AdminUsersService.patchSurveyStaff({
            userName: scope.userName,
            password: scope.password,
            name: scope.name,
            surveyId: scope.surveyId,
            email: scope.email,
            phone: scope.phone
        });
    } else if (scope.userType == USER_TYPE_RESPONDENT) {
        return AdminUsersService.patchSurveyRespondent({
            userName: scope.userName,
            password: scope.password,
            name: scope.name,
            surveyId: scope.surveyId,
            email: scope.email,
            phone: scope.phone
        });
    }
}
