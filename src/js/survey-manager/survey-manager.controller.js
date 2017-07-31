/**
 * Created by Tim Osadchiy on 18/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.controller("SurveyManagerController", ["$scope", "$route", "appRoutes",
        controllerFun]);
};

function controllerFun($scope, $route, appRoutes) {

    $scope.directiveViews = {
        newSurvey: new DirectiveView([appRoutes.surveyManagerNew]),
        list: new DirectiveView([appRoutes.surveyManager]),
        survey: new DirectiveView([appRoutes.surveyManagerSurvey,
            appRoutes.surveyManagerSurveyDescription,
            appRoutes.surveyManagerSurveyUsers,
            appRoutes.surveyManagerSurveyResults])
    };

    activateView($scope.directiveViews, $route.current.$$route.originalPath);

}

function DirectiveView(paths) {
    this.paths = paths;
    this.active = false;
}

function activateView(directiveViews, pathPattern) {
    for (var i in directiveViews) {
        if (directiveViews[i].paths.filter(function (path) {
                return path == pathPattern;
            }).length) {
            directiveViews[i].active = true;
            return;
        }
    }
    directiveViews.list.active = true;
}