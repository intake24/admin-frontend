/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyResults", ["SurveyService", "uiDatetimePickerConfig", directiveFun]);
};

function directiveFun(SurveyService, uiDatetimePickerConfig) {

    function controller(scope, element, attribute) {

        scope.dateFrom = null;
        scope.dateTo = null;

        scope.uiDatetimePickerConfig = uiDatetimePickerConfig;

        scope.loading = false;

        scope.formValidation = {
            queryPeriod: true
        };

        scope.datePickerState = {
            fromIsOpen: false,
            toIsOpen: false
        };

        scope.openDateFromPicker = function () {
            scope.datePickerState.fromIsOpen = true;
        };

        scope.openDateToPicker = function () {
            scope.datePickerState.toIsOpen = true;
        };

        scope.download = function () {
            if (!validateForm(scope)) {
                return;
            }
            scope.loading = true;
            SurveyService.getCsvResults(scope.survey.id, getRequest(scope)).finally(function () {
                scope.loading = false;
            });
        };

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
        template: require("./survey-results.directive.html")
    }

}

function getRequest(scope) {
    return {
        dateFrom: scope.dateFrom,
        dateTo: scope.dateTo
    };
}

function validateForm(scope) {

    scope.formValidation.queryPeriod = scope.dateFrom != null &&
        scope.dateTo != null &&
        scope.dateTo >= scope.dateFrom;

    return scope.formValidation.queryPeriod;

}

function updateScope(scope, data) {
    if (!data) {
        return;
    }
    scope.dateFrom = new Date(data.startDate);
    scope.dateTo = new Date(data.endDate);
}
