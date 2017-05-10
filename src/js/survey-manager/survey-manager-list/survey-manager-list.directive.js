/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

var _ = require('underscore');

module.exports = function (app) {
    app.directive("surveyManagerList", ["LocalesService", "UserStateService", "SurveyService", "appRoutes", "$q", directiveFun]);
};

function directiveFun(LocalesService, UserStateService, SurveyService, appRoutes, $q) {

    function controller(scope, element, attribute) {

        function applyFilter() {
            scope.filteredSurveys = _.groupBy(_.sortBy(_.filter(scope.allSurveys, function(survey) { return survey.id.search(scope.searchQuery) > -1; }), function (survey) { return survey.id; }), function(survey) { return survey.localeId; });
            scope.filteredLocales = _.filter(scope.allLocales, function(locale) { return scope.filteredSurveys.hasOwnProperty(locale.id); });
            scope.noSurveys = _.isEmpty(scope.filteredSurveys);
        }

        scope.searchQuery = "";

        scope.allSurveys = {};

        scope.loading = true;

        scope.newSurveyUrl = appRoutes.surveyManagerNew;

          $q.all([SurveyService.list(), LocalesService.list()]).then(
            function(data) {
                scope.allSurveys = data[0];
                scope.allLocales = data[1];
                applyFilter();
            }
        ).finally(function() {
            scope.loading = false;
        });

        scope.$watch("searchQuery", function() {
            applyFilter();
        });

        scope.$watch( function() { return UserStateService.getUserInfo(); }, function(newValue, oldValue) {
            scope.currentUser = newValue;
        });

    }

    return {
        restrict: "E",
        scope: {},
        link: controller,
        template: require("./survey-manager-list.directive.html")
    }

}
