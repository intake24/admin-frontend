"use strict";

var _ = require("underscore");

module.exports = function (app) {
    app.controller("FoodCompositionEditController", ["$scope", "FoodCompositionTablesService", "$routeParams", controllerFun]);
};

function controllerFun($scope, FoodCompositionTablesService, $routeParams) {

    //FoodCompositionTablesService.

    $scope.nutrients = [
        {
            id: 1,
            name: "Energy",
            unit: "kcal"
        },
        {
            id: 2,
            name: "Water",
            unit: "g"
        }

    ];

    $scope.mapping = {
        rowOffset: 2,

        columns: [
            {
                nutrientId: 1,
                columnOffset: 12
            },
            {
                nutrientId: 1,
                columnOffset: 121
            },
            {
                nutrientId: 2,
                columnOffset: 1232
            },
            {
                nutrientId: 2,
                columnOffset: 1243
            },
            {
                nutrientId: 1,
                columnOffset: 32
            }]
    };


    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    $scope.offsetToExcelColumn = function (offset) {

        var result = "";

        while (offset > letters.length) {
            var d = Math.floor(offset / letters.length) - 1;
            var rem = offset % letters.length;

            result = letters.charAt(rem) + result;
            offset = d;
        }

        return letters.charAt(offset) + result;
    };

    $scope.excelColumnToOffset = function (column) {
        var result = 0;
        var f = 1;

        for (var i = column.length - 1; i >= 0; i--) {
            result += f * letters.indexOf(column.charAt(i) + 1);
        }

        return result;
    };


    $scope.nutrientLabel = function (id) {
        var nutrient = _.find($scope.nutrients, function (n) {
            return n.id == id;
        });

        if (nutrient)
            return nutrient.name + " (" + nutrient.unit + ")";
        else
            return "#NOTFOUND"
    };

    console.log($routeParams);
}
