/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyEditForm", ["LocalesService", "SurveyService", "UserStateService",
        "uiDatetimePickerConfig", directiveFun]);
};

function directiveFun(LocalesService, SurveyService, UserStateService, uiDatetimePickerConfig) {

    function controller(scope, element, attribute) {

        scope.uiDatetimePickerConfig = uiDatetimePickerConfig;
        scope.surveyStateOptions = [
            {value: "0", text: "Has not started"},
            {value: "2", text: "Active"},
            {value: "1", text: "Suspended"}
        ];

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
            var def;
            scope.loading = true;
            if (!scope.survey) {
                def = SurveyService.create(getRequest(scope));
            } else {
                def = SurveyService.patch(scope.survey.id, getRequest(scope)).then(function (data) {
                    updateScope(scope, data);
                    updateSurvey(scope, data);
                    return data;
                });
            }
            def.then(function (data) {
                if (scope.onSaved) {
                    scope.onSaved(data);
                }
            }).finally(function () {
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

        scope.$watch(function() { return UserStateService.getUserInfo(); }, function(newValue) {
            scope.currentUser = newValue;
        })

    }

    return {
        restrict: "E",
        scope: {
            survey: "=?",
            onSaved: "=?"
        },
        link: controller,
        template: require("./survey-edit-form.directive.html")
    }

}

function getRequest(scope) {
    return {
        id: scope.name,
        state: scope.state,
        startDate: scope.startDate.toISOString(),
        endDate: scope.endDate.toISOString(),
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

    scope.formValidation.surveyPeriod = scope.startDate != null &&
        scope.endDate != null &&
        scope.endDate >= scope.startDate;

    return scope.formValidation.name &&
        scope.formValidation.supportEmail &&
        scope.formValidation.surveyPeriod;

}

function updateScope(scope, data) {
    if (!data) {
        scope.name = "";
        scope.state = "0";
        scope.selectedLocale = "en_GB";
        scope.allowGeneratedUsers = false;
        scope.externalFollowUpUrl = "";
        scope.supportEmail = "";
        scope.startDate = null;
        scope.endDate = null;
    } else {
        scope.name = data.id;
        scope.state = String(data.state);
        scope.selectedLocale = data.localeId;
        scope.allowGeneratedUsers = data.allowGeneratedUsers;
        scope.externalFollowUpUrl = data.externalFollowUpURL;
        scope.supportEmail = data.supportEmail;
        scope.startDate = new Date(data.startDate);
        scope.endDate = new Date(data.endDate);
    }
}

function updateSurvey(scope, data) {
    scope.survey.id = data.id;
    scope.survey.state = data.state;
    scope.survey.localeId = data.localeId;
    scope.survey.llowGeneratedUsers = data.llowGeneratedUsers;
    scope.survey.externalFollowUpURL = data.externalFollowUpURL;
    scope.survey.supportEmail = data.supportEmail;
    scope.survey.startDate = data.startDate;
    scope.survey.endDate = data.endDate;
}
