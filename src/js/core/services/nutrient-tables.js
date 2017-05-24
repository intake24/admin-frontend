/**
 * Created by Tim Osadchiy on 24/05/2017.
 */

"use strict";

module.exports = function (app) {

  app.service("NutrientTables", ["$http", serviceFun]);

};

function serviceFun($http) {
    var baseUrl = window.api_base_url + "admin/nutrient-tables";

    function unpackNutrientTableRecord(data) {
        return {
            id: data.id,
            nutrientTableId: data.nutrientTableId,
            description: data.description,
            localDescription: data.localDescription[0]
        };
    }

    return {
        searchNutrientTableRecords: function(nutrientTableId, query) {
            var url = baseUrl + "/" + nutrientTableId + (query ? "?query=" + query : "");
            return $http.get(url).then(function (data) {
                return data.map(unpackNutrientTableRecord);
            });
        }
    }
}
