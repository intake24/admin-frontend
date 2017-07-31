/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyView", ["SurveyService", "UserStateService",
        "appRoutes", "$route", "$routeParams", "$location", directiveFun]);
    require("./survey-general/survey-general.directive")(app);
    require("./survey-description/survey-description.directive")(app);
    require("./survey-results/survey-results.directive")(app);
    require("./survey-users/survey-users.directive")(app);
};

function directiveFun(SurveyService, UserStateService, appRoutes, $route, $routeParams, $location) {

    function controller(scope, element, attribute) {

        scope.survey = null;

        scope.surveyId = $routeParams.surveyId;

        scope.taskId = $routeParams.taskId;

        scope.directiveViews = {
            general: new SurveyView("General", appRoutes.surveyManagerSurvey),
            description: new SurveyView("Welcome page", appRoutes.surveyManagerSurveyDescription),
            users: new SurveyView("Users", appRoutes.surveyManagerSurveyUsers),
            results: new SurveyView("Data export", appRoutes.surveyManagerSurveyResults)
        };

        scope.delete = function () {
            if (!confirm("Are you sure you want to delete this survey?")) {
                return;
            }
            SurveyService.delete(scope.surveyId).then(function () {
                $location.path(appRoutes.surveyManager);
            });
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

        scope.$watch("survey.id", function (newVal, oldVal) {
            if (newVal && oldVal && newVal != oldVal) {
                $location.path(appRoutes.surveyManagerSurvey.replace(":surveyId", newVal)).replace();
            }
        });

        scope.$watch( function() { return UserStateService.getUserInfo(); }, function(newValue, oldValue) {
            scope.currentUser = newValue;
        });

        SurveyService.get($routeParams.surveyId).then(function (data) {
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
