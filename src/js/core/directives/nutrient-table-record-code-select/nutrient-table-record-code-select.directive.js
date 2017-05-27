/**
 * Created by Tim Osadchiy on 25/05/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("nutrientTableRecordCodeSelect", ["$q", "NutrientTables", directiveFun]);
};

function directiveFun($q, NutrientTables) {

    function controller(scope, element, attributes) {

        scope.uiSelect = {
            selected: null
        };

        scope.nutrientTableRecords = [];

        scope.findNutrientTableRecords = function (query) {
            if (scope.nutrientTableId == null || query.trim() == null) {
                return $q.resolve();
            }
            return NutrientTables.searchNutrientTableRecords(scope.nutrientTableId, query).then(function (data) {
                var d = data.filter(function (item) {
                    return item.id != "";
                });
                scope.nutrientTableRecords.length = 0;
                scope.nutrientTableRecords.push.apply(scope.nutrientTableRecords, d);
                return d;
            });
        };

        scope.$watch("uiSelect.selected", function (newVal, oldVal) {
            if (newVal != oldVal) {
                scope.foodCode = newVal != null ? newVal.id : null;
            }
        });

        scope.getFoodTitle = function (item) {
            if (item == null) {
                return "Search foods";
            } else {
                return item.id + (item.description ? ", " + item.description : "");
            }
        };

        scope.findNutrientTableRecords(scope.foodCode).then(function (data) {
            scope.uiSelect.selected = data.filter(function (item) {
                return item.id == scope.foodCode;
            })[0];
        });

    }

    return {
        restrict: "E",
        link: controller,
        scope: {
            nutrientTableId: "=?",
            foodCode: "=?"
        },
        template: require("./nutrient-table-record-code-select.directive.pug")
    };
}

