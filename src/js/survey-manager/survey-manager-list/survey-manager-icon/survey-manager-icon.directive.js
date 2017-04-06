"use strict";

module.exports = function (app) {
    app.directive("surveyManagerIcon", ["appRoutes", directiveFun]);
};

function directiveFun(appRoutes) {

    function controller(scope, element, attribute) {
        scope.getSurveyUrl = function (id) {
            return appRoutes.surveyManagerSurvey.replace(":surveyId", id);
        };
    }

    return {
        restrict: "E",
        scope: {
            survey: "="
        },
        link: controller,
        template: require("./survey-manager-icon.directive.html")
    }

}
