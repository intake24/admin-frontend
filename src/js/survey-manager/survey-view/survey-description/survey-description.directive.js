/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyDescription", ["$sce", "SurveyService", "UserStateService",
        "uiDatetimePickerConfig", directiveFun]);
};

function directiveFun($sce, SurveyService, UserStateService, uiDatetimePickerConfig) {

    function controller(scope, element, attribute) {

        scope.description = "";
        scope.preview = "";

        scope.previewMode = false;

        scope.textAreaMode = getUserAccessTextareaMode(UserStateService);

        scope.textAreaModeIsAllowed = getUserAccessTextareaMode(UserStateService);

        scope.loading = false;

        scope.cancel = function () {
            updateScope(scope, scope.survey);
        };

        scope.showPreview = function () {
            scope.preview = $sce.trustAsHtml(scope.description);
            scope.previewMode = true;
        };

        scope.hidePreview = function () {
            scope.previewMode = false;
        };

        scope.setTextareaMode = function (val) {
            scope.textAreaMode = val;
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

function getUserAccessTextareaMode(userService) {
    var ui = userService.getUserInfo();
    if (!ui) {
        return false;
    } else {
        return ui.isSuperUser() || ui.isGlobalSurveyAdmin();
    }
}
