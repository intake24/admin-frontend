"use strict";

var _ = require("underscore");

module.exports = function (app) {
    app.controller("RecalculateNutrientsController", ["$scope", "RecalculateNutrientsService",
        "SurveyService", "MessageService", "appRoutes", controllerFun]);
};

function controllerFun($scope, RecalculateNutrientsService, SurveyService, MessageService, AppRoutes) {

    $scope.surveyIds = [];

    SurveyService.list().then(function (surveys) {
        $scope.surveyIds = surveys.map(function (survey) {
            return survey.id
        });
    });

    $scope.recalculateNutrients = function() {
        RecalculateNutrientsService.recalculateNutrients($scope.targetSurveyId);
    }

}
