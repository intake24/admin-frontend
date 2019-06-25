"use strict";

var _ = require("underscore");

module.exports = function (app) {
    app.controller("FoodCompositionEditController", ["$scope", "FoodCompositionTablesService", "$routeParams", "$location",
        "MessageService", controllerFun]);
};

function controllerFun($scope, FoodCompositionTablesService, $routeParams, $location, MessageService) {

    FoodCompositionTablesService.getNutrientTypes().then(function (data) {
        $scope.nutrients = data;
    });

    FoodCompositionTablesService.getFoodCompositionTable($routeParams.tableId).then(function (data) {
        $scope.table = data;
    });

    $scope.nutrientColumnsCollapsed = true;

    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function offsetToExcelColumn(offset) {
        if (offset != null) {
            var result = "";

            while (offset > (letters.length - 1)) {
                var d = Math.floor(offset / letters.length) - 1;
                var rem = offset % letters.length;

                result = letters.charAt(rem) + result;
                offset = d;
            }

            return letters.charAt(offset) + result;
        } else
            return undefined;
    }

    function excelColumnToOffset(column) {
        if (column != null) {
            column = column.toUpperCase();
            var result = 0;
            var f = 1;

            for (var i = column.length - 1; i >= 0; i--) {
                result += f * (letters.indexOf(column.charAt(i)) + 1);
                f *= 26;
            }

            return result - 1;
        } else
            return undefined;
    }

    $scope.idColumnOffsetModel = function (newVal) {
        if (arguments.length) {
            if (newVal) {
                $scope.table.mapping.idColumnOffset = excelColumnToOffset(newVal);
            }
            return $scope.table.mapping.idColumnOffset;
        } else {
            if ($scope.table)
                return offsetToExcelColumn($scope.table.mapping.idColumnOffset);
            else
                return undefined;
        }
    };

    $scope.descriptionColumnOffsetModel = function (newVal) {
        if (arguments.length) {
            if (newVal) {
                $scope.table.mapping.descriptionColumnOffset = excelColumnToOffset(newVal);
            }
            return $scope.table.mapping.descriptionColumnOffset;
        } else {
            if ($scope.table)
                return offsetToExcelColumn($scope.table.mapping.descriptionColumnOffset);
            else
                return undefined;

        }
    };

    $scope.localDescriptionColumnOffsetModel = function (newVal) {
        if (arguments.length) {
            if (newVal) {
                $scope.table.mapping.localDescriptionColumnOffset = excelColumnToOffset(newVal);
            }
            return $scope.table.mapping.localDescriptionColumnOffset;
        } else {
            if ($scope.table)
                return offsetToExcelColumn($scope.table.mapping.localDescriptionColumnOffset);
            else
                return undefined;
        }
    };

    $scope.columnOffsetModel = function (newVal) {
        if (arguments.length) {
            if (newVal) {
                this.columnOffset = excelColumnToOffset(newVal);
            }
            return this.columnOffset;
        } else {
            return offsetToExcelColumn(this.columnOffset);
        }
    };

    $scope.deleteMappingColumn = function (deleted) {
        $scope.table.mapping.nutrientColumns = _.filter($scope.table.mapping.nutrientColumns, function (col) {
            return col != deleted;
        });
    };

    $scope.addMappingColumn = function () {
        $scope.table.mapping.nutrientColumns.push({
            nutrientId: 1,
            columnOffset: 0
        });
    };

    function packTableForUpdate() {
        function cleanNutrientColumn(col) {
            return {
                columnOffset: col.columnOffset,
                nutrientId: col.nutrientId
            }
        }

        return {
            id: $scope.table.id,
            description: $scope.table.description,
            mapping: {
                rowOffset: $scope.table.mapping.rowOffset,
                idColumnOffset: $scope.table.mapping.idColumnOffset,
                descriptionColumnOffset: $scope.table.mapping.descriptionColumnOffset,
                localDescriptionColumnOffset: $scope.table.mapping.localDescriptionColumnOffset,
                nutrientColumns: _.map($scope.table.mapping.nutrientColumns, cleanNutrientColumn)
            }
        };
    }

    $scope.save = function () {

        var newId = $scope.table.id;

        FoodCompositionTablesService.updateFoodCompositionTable($routeParams.tableId, packTableForUpdate()).then(
            $location.path($location.path().replace($routeParams.tableId, newId))
        );

    };

    $scope.nutrientName = function (id) {

        for (var i = 0; i < $scope.nutrients.length; i++) {
            if ($scope.nutrients[i].id == id)
                return $scope.nutrients[i].name;
        }

        return undefined;
    };

    $scope.uploadSpreadsheet = function (files) {
        FoodCompositionTablesService.uploadFoodCompositionSpreadsheet($routeParams.tableId, files[0]).then(
            function () {
                MessageService.showSuccess("Food composition table updated successfully");
            }
        );
    };
}
