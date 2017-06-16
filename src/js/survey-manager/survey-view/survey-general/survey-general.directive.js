/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyGeneral", ["LocalesService", "SurveyService",
        "uiDatetimePickerConfig", directiveFun]);
};

function directiveFun(LocalesService, SurveyService, uiDatetimePickerConfig) {

    function controller(scope, element, attribute) {

        scope.name = "";
        scope.selectedLocale = null;
        scope.allowGeneratedUsers = false;
        scope.externalFollowUpURL = "";
        scope.supportEmail = "";
        scope.startDate = null;
        scope.endDate = null;

        scope.uiDatetimePickerConfig = uiDatetimePickerConfig;

        scope.loading = false;

        scope.formValidation = {
            name: true,
            supportEmail: true,
            surveyPeriod: true
        };

        scope.datePickerState = {
            startIsOpen: false,
            endIsOpen: false
        };

        scope.locales = [];

        scope.openStartDatePicker = function () {
            scope.datePickerState.startIsOpen = true;
        };

        scope.openEndDatePicker = function () {
            scope.datePickerState.endIsOpen = true;
        };

        scope.cancel = function () {
            updateScope(scope, scope.survey);
        };

        scope.save = function () {
            if (!validateForm(scope)) {
                return;
            }
            scope.loading = true;
            SurveyService.patch(scope.name, getRequest(scope)).finally(function () {
                scope.loading = false;
            });
        };

        scope.$watch("survey", function (newVal) {
            updateScope(scope, newVal);
        });

        LocalesService.list().then(function (locales) {
            scope.locales = locales;
        });

    }

    return {
        restrict: "E",
        scope: {
            survey: "=?"
        },
        link: controller,
        template: require("./survey-general.directive.html")
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

    scope.formValidation.name = scope.newName.trim() != "";

    scope.formValidation.supportEmail = scope.newSupportEmail.trim() != "";

    scope.formValidation.surveyPeriod = scope.newStartDate != null &&
        scope.newEndDate != null &&
        scope.newEndDate >= scope.newStartDate;

    return scope.formValidation.name &&
        scope.formValidation.supportEmail &&
        scope.formValidation.surveyPeriod;

}

function updateScope(scope, data) {
    if (!data) {
        return;
    }
    scope.name = data.id;
    scope.selectedLocale = data.localeId;
    scope.allowGeneratedUsers = data.allowGeneratedUsers;
    scope.externalFollowUpURL = data.externalFollowUpURL;
    scope.supportEmail = data.supportEmail;
    scope.startDate = new Date(data.startDate);
    scope.endDate = new Date(data.endDate);
}
