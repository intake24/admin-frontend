"use strict";

var getFormedUrl = require("../../core/utils/get-formed-url");

module.exports = function (app) {
    app.service("DeriveLocaleService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    return {
        deriveLocale: function (sourceLocale, targetLocale, file) {
            var fd = new FormData();
            fd.append("file", file);
            fd.append("sourceLocale", sourceLocale);
            fd.append("targetLocale", targetLocale);

            return $http.post($window.api_base_url + "v2/foods/derive-locale", fd, {
                transformRequest: angular.identity,
                headers: {"Content-Type": undefined}
            });
        }
    };
}
