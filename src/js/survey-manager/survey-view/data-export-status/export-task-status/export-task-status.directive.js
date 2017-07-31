"use strict";

module.exports = function (app) {
    app.directive("surveyResults", ["SurveyService", "uiDatetimePickerConfig", directiveFun]);
};

function directiveFun(SurveyService, uiDatetimePickerConfig) {

    function controller(scope, element, attribute) {

    }

    return {
        restrict: "E",
        scope: {
            survey: "=?"
        },
        link: controller,
        template: require("./export-task-status.directive.html")
    }
}
