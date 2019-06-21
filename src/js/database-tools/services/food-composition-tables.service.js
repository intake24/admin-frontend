"use strict";


module.exports = function (app) {
    app.service("FoodCompositionTablesService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    return {

        getFoodCompositionTables: function () {
            return $http.get($window.api_base_url + "tools/foods/composition/tables");
        },

        getFoodCompositionTable: function (tableId) {
            return $http.get($window.api_base_url + "tools/foods/composition/tables/" + tableId);
        },

        getNutrientTypes: function () {
            return $http.get($window.api_base_url + "tools/foods/composition/nutrients");
        },

        updateFoodCompositionTable: function (tableId, updatedTable) {
            return $http.post($window.api_base_url + "tools/foods/composition/tables/" + tableId, JSON.stringify(updatedTable));
        }

    };
}

