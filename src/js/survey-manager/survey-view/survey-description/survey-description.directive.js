/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyDescription", ["SurveyService",
        "uiDatetimePickerConfig", directiveFun]);
};

function directiveFun(SurveyService, uiDatetimePickerConfig) {

    function controller(scope, element, attribute) {

        scope.description = "";

        scope.previewMode = false;

        scope.loading = false;

        scope.cancel = function () {
            updateScope(scope, scope.survey);
        };

        scope.showPreview = function () {
            scope.previewMode = true;
        };

        scope.hidePreview = function () {
            scope.previewMode = false;
        };

        scope.save = function () {
            scope.loading = true;
            SurveyService.patch(scope.survey.id, getRequest(scope))
                .then(function (data) {
                    updateScope(scope, data);
                    updateSurvey(scope, data);
                })
                .finally(function () {
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
        template: require("./survey-description.directive.html")
    }

}

function getRequest(scope) {
    return {
        id: scope.survey.id,
        state: scope.survey.state,
        startDate: scope.survey.startDate,
        endDate: scope.survey.endDate,
        schemeId: scope.survey.schemeId,
        localeId: scope.survey.localeId,
        allowGeneratedUsers: scope.survey.allowGeneratedUsers,
        externalFollowUpURL: scope.survey.externalFollowUpURL,
        supportEmail: scope.survey.supportEmail,
        description: scope.description
    };
}

function updateScope(scope, data) {
    if (!data) {
        return;
    }
    scope.description = data.description;
}

function updateSurvey(scope, survey) {
    survey.description = scope.description;
}
