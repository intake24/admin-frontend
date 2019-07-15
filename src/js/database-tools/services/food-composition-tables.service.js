"use strict";


module.exports = function (app) {
    app.service("FoodCompositionTablesService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    return {

        getFoodCompositionTables: function () {
            return $http.get($window.api_base_url + "v2/foods/composition/tables");
        },

        getFoodCompositionTable: function (tableId) {
            return $http.get($window.api_base_url + "v2/foods/composition/tables/" + tableId);
        },

        getNutrientTypes: function () {
            return $http.get($window.api_base_url + "v2/foods/composition/nutrients");
        },

        updateFoodCompositionTable: function (tableId, updatedTable) {
            return $http.patch($window.api_base_url + "v2/foods/composition/tables/" + tableId, JSON.stringify(updatedTable));
        },

        createFoodCompositionTable: function (newTable) {
            return $http.post($window.api_base_url + "v2/foods/composition/tables", JSON.stringify(newTable));
        },

        uploadFoodCompositionSpreadsheet: function(tableId, file) {
            var fd = new FormData();
            fd.append("file", file);
            return $http.patch($window.api_base_url + "v2/foods/composition/tables/" + tableId + "/csv", fd, {
                transformRequest: angular.identity,
                headers: { "Content-Type": undefined}
            });
        }
    };
}
