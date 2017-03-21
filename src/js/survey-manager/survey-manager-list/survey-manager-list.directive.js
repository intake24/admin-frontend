/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyManagerList", ["LocalesService", "SurveyService", "appRoutes", directiveFun]);
};

function directiveFun(LocalesService, SurveyService, appRoutes) {

    function controller(scope, element, attribute) {

        scope.searchQuery = "";

        scope.surveys = [];

        scope.loading = true;

        scope.newSurveyUrl = appRoutes.surveyManagerNew;

        scope.getSurveyUrl = function (id) {
            return appRoutes.surveyManagerSurvey.replace(":surveyId", id);
        };

        SurveyService.list().then(function (data) {
            scope.surveys = data;
        }).finally(function () {
            scope.loading = false;
        });

    }

    return {
        restrict: "E",
        scope: {},
        link: controller,
        template: require("./survey-manager-list.directive.html")
    }

}
