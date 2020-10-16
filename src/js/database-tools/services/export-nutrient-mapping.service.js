"use strict";

var getFormedUrl = require("../../core/utils/get-formed-url");

module.exports = function (app) {
    app.service("NutrientMappingExportService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    return {
        exportMapping: function (localeId) {
            return $http.post($window.api_base_url + "v2/foods/admin/" + localeId + "/export-mapping?forceBOM=1");
        }
    };
}
