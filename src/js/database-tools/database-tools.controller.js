"use strict";

var _ = require("underscore");

module.exports = function (app) {
    app.controller("DatabaseToolsController", ["$scope", "LocalesService", "SurveyService", "DatabaseToolsService", controllerFun]);
};

function controllerFun($scope, LocalesService, SurveyService, DatabaseToolsService) {

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
    $scope.requestInProgress = false;

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
    };

    $scope.requestExport = function () {
        $scope.requestInProgress = true;

        var limitToSurveys;

        if (_.isEqual($scope.surveySelect.availableIds, $scope.surveySelect.selectedIds))
            limitToSurveys = [];
        else
            limitToSurveys = $scope.surveySelect.selectedIds;

        DatabaseToolsService.exportFoodFrequencies($scope.selectedLocale, limitToSurveys)
            .then( function(){
                $scope.requestInProgress = false;
            });

    };
}
