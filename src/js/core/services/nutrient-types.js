/**
 * Created by Tim Osadchiy on 16/02/2017.
 */

"use strict";

module.exports = function (app) {

  app.service("NutrientTypes", ["$http", serviceFun]);

};

function serviceFun($http) {
    var nutrienTypesUrl = window.api_base_url + "admin/nutrient-types";

    return {
        list: function () {
            return $http.get(nutrienTypesUrl);
        }
    }
}
