/**
 * Created by Tim Osadchiy on 18/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.controller("SurveyManagerController", ["$scope", "$location", "$route", "$routeParams", "appRoutes",
        controllerFun]);
};

function controllerFun($scope, $location, $route, $routeParams, appRoutes) {

    $scope.directiveViews = {
        newSurvey: new DirectiveView(appRoutes.surveyManagerNew),
        list: new DirectiveView(appRoutes.surveyManagerList),
        survey: new DirectiveView(appRoutes.surveyManagerSurvey),
    };

    activateSurvey($scope.directiveViews, $route.current.$$route.originalPath);

}

function DirectiveView(path) {
    this.path = path;
    this.active = false;
}

function activateSurvey(directiveViews, pathPattern) {
    for (var i in directiveViews) {
        if (directiveViews[i].path == pathPattern) {
            directiveViews[i].active = true;
            return;
        }
    }
    directiveViews.list.active = true;
}