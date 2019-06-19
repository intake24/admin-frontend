"use strict";

var _ = require("underscore");

module.exports = function (app) {
    app.controller("FoodCompositionController", ["$scope", "FoodCompositionTablesService", "$routeParams", controllerFun]);
};

function controllerFun($scope, FoodCompositionTablesService, $routeParams) {

    FoodCompositionTablesService.getFoodCompositionTables().then(function (data) {
        $scope.foodCompositionTables = data;
    });

}
