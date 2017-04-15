/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyManagerNew", ["$location", "LocalesService", "SurveyService", "appRoutes", directiveFun]);
};

function directiveFun($location, LocalesService, SurveyService, appRoutes) {

    function controller(scope, element, attribute) {

        scope.onSaved = function (data) {
            $location.path(appRoutes.surveyManagerSurvey.replace(":surveyId", data.id));
        };

    }

    return {
        restrict: "E",
        scope: {},
        link: controller,
        template: require("./survey-manager-new.directive.html")
    }

}
