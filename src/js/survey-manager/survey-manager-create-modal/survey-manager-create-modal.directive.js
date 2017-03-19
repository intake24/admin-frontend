/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyManagerCreateModal", ["LocalesService", "SurveyService", directiveFun]);
};

function directiveFun(LocalesService, SurveyService) {

    function controller(scope, element, attribute) {

        scope.name = "";
        scope.selectedLocale = null;
        scope.allowGeneratedUsers = false;
        scope.externalFollowUpUrl = "";
        scope.supportEmail = "";

        scope.formValidation = {
            name: true,
            supportEmail: true
        };

        scope.isVisible = true;
        scope.locales = [];

        scope.close = function () {
            scope.isVisible = !scope.isVisible;
        };

        scope.save = function () {
            if (!validateForm(scope)) {
                return;
            }
            SurveyService.create(getRequest(scope));
        };

        scope.$watch(function () {
            return LocalesService.list();
        }, function () {
            scope.locales = LocalesService.list();
        });

        scope.$watch(function () {
            return LocalesService.current();
        }, function () {
            scope.selectedLocale = LocalesService.current();
        });

    }

    return {
        restrict: "E",
        scope: {},
        link: controller,
        template: require("./survey-manager-create-modal.directive.html")
    }

}

function getRequest(scope) {
    return {
        surveyId: scope.name,
        schemeId: "default",
        localeId: scope.selectedLocale,
        allowGeneratedUsers: scope.allowGeneratedUsers,
        externalFollowUpUrl: scope.externalFollowUpUrl,
        supportEmail: scope.supportEmail
    };
}

function validateForm(scope) {

    scope.formValidation.name = scope.name.trim() != "";

    scope.formValidation.supportEmail = scope.supportEmail.trim() != "";

    return scope.formValidation.name &&
        scope.formValidation.supportEmail;

}
