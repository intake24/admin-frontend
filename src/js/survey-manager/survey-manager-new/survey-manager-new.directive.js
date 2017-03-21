/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyManagerNew", ["LocalesService", "SurveyService", directiveFun]);
};

function directiveFun(LocalesService, SurveyService) {

    function controller(scope, element, attribute) {

        scope.name = "";
        scope.selectedLocale = null;
        scope.allowGeneratedUsers = false;
        scope.externalFollowUpUrl = "";
        scope.supportEmail = "";

        scope.loading = false;

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
            scope.loading = true;
            SurveyService.create(getRequest(scope)).finally(function () {
                scope.loading = false;
            });
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
        template: require("./survey-manager-new.directive.html")
    }

}

function getRequest(scope) {
    return {
        id: scope.name,
        schemeId: "default",
        localeId: scope.selectedLocale,
        allowGeneratedUsers: scope.allowGeneratedUsers,
        externalFollowUpURL: scope.externalFollowUpURL,
        supportEmail: scope.supportEmail
    };
}

function validateForm(scope) {

    scope.formValidation.name = scope.name.trim() != "";

    scope.formValidation.supportEmail = scope.supportEmail.trim() != "";

    return scope.formValidation.name &&
        scope.formValidation.supportEmail;

}
