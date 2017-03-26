/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyView", ["LocalesService", "SurveyService", "appRoutes",
        "$route", "$routeParams", directiveFun]);
    require("./survey-description/survey-description.directive")(app);
    require("./survey-results/survey-results.directive")(app);
};

function directiveFun(LocalesService, SurveyService, appRoutes, $route, $routeParams) {

    function controller(scope, element, attribute) {

        scope.title = "";

        scope.survey = null;

        scope.surveyId = $routeParams.surveyId;

        scope.directiveViews = {
            general: new SurveyView("General", appRoutes.surveyManagerSurvey),
            users: new SurveyView("Users", appRoutes.surveyManagerSurveyUsers),
            results: new SurveyView("Results", appRoutes.surveyManagerSurveyResults)
        };

        scope.getViewList = function () {
            var r = [];
            for (var i in scope.directiveViews) {
                if (scope.directiveViews.hasOwnProperty(i)) {
                    r.push(scope.directiveViews[i]);
                }
            }
            return r;
        };

        SurveyService.get($routeParams.surveyId).then(function (data) {
            scope.title = data.id;
            scope.survey = data;
        });

        activateView(scope.directiveViews, $route.current.$$route.originalPath);

    }

    return {
        restrict: "E",
        scope: {},
        link: controller,
        template: require("./survey-view.directive.html")
    }

}

function SurveyView(name, pathTemplate) {
    this.name = name;
    this.path = pathTemplate;
    this.active = false;
}

SurveyView.prototype.getUrl = function (surveyId) {
    return this.path.replace(":surveyId", surveyId);
};

function activateView(directiveViews, pathPattern) {
    for (var i in directiveViews) {
        if (directiveViews[i].path == pathPattern) {
            directiveViews[i].active = true;
            return;
        }
    }
    directiveViews.list.active = true;
}
