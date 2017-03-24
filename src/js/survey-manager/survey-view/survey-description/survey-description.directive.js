/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyDescription", ["LocalesService", "SurveyService", "appRoutes",
        "$route", "$routeParams", "uiDatetimePickerConfig", directiveFun]);
};

function directiveFun(LocalesService, SurveyService,
                      appRoutes, $route, $routeParams, uiDatetimePickerConfig) {

    function controller(scope, element, attribute) {

        scope.name = "";
        scope.selectedLocale = null;
        scope.allowGeneratedUsers = false;
        scope.externalFollowUpUrl = "";
        scope.supportEmail = "";
        scope.startDate = null;
        scope.endDate = null;

        scope.uiDatetimePickerConfig = uiDatetimePickerConfig;

        scope.loading = false;

        scope.formValidation = {
            name: true,
            supportEmail: true
        };

        scope.datePickerState = {
            startIsOpen: false,
            endIsOpen: false
        };

        scope.isVisible = true;
        scope.locales = [];

        scope.openStartDatePicker = function () {
            scope.datePickerState.startIsOpen = true;
        };

        scope.openEndDatePicker = function () {
            scope.datePickerState.endIsOpen = true;
        };

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

        scope.$watch("survey", function (newVal) {
            updateScope(scope, newVal);
        });

    }

    return {
        restrict: "E",
        scope: {
            survey: "=?"
        },
        link: controller,
        template: require("./survey-description.directive.html")
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

function updateScope(scope, data) {
    if (!data) {
        return;
    }
    scope.name = data.id;
    scope.selectedLocale = data.localeId;
    scope.allowGeneratedUsers = data.allowGeneratedUsers;
    scope.externalFollowUpUrl = data.externalFollowUpURL;
    scope.supportEmail = data.supportEmail;
    scope.startDate = new Date(data.startDate);
    scope.endDate = new Date(data.endDate);
}
