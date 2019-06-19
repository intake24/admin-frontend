"use strict";


module.exports = function (app) {
    app.service("FoodCompositionTablesService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    return {

        getFoodCompositionTables: function () {
            return $http.get($window.api_base_url + "tools/foods/composition");
        }
    };
}

