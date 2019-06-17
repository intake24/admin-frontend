"use strict";

var _ = require("underscore");

module.exports = function (app) {
    app.controller("DatabaseToolsController", ["$scope", "LocalesService", "SurveyService", controllerFun]);
};

function controllerFun($scope, LocalesService, SurveyService) {

    LocalesService.list().then(function (locales) {
        $scope.locales = locales;
        $scope.selectedLocale = _.find(locales, function (locale) {
            return locale.id == "en_GB";
        });
    });

    $scope.surveySelect = {
        availableIds: [],
        selectedIds: []
    };

    $scope.surveysSectionOpen = false;

    $scope.$watch("selectedLocale", function (locale) {
        if (locale) {
            SurveyService.list().then(function (surveys) {
                var surveysInThisLocale = _.filter(surveys, function (s) {
                    return s.localeId == locale.id
                });
                var localSurveyIds = _.pluck(surveysInThisLocale, "id");
                $scope.surveySelect.availableIds = localSurveyIds;
                $scope.surveySelect.selectedIds = localSurveyIds;

            });
        }
    });

    $scope.toggleSurveysSection = function() {
      $scope.surveysSectionOpen = !$scope.surveysSectionOpen;
    };

    $scope.includeAllSurveys = function () {
        $scope.surveySelect.selectedIds = $scope.surveySelect.availableIds;
    };

    $scope.clearSurveys = function () {
        $scope.surveySelect.selectedIds = [];
    }
}
