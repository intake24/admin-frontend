"use strict";

var getFormedUrl = require("../../core/utils/get-formed-url");

module.exports = function (app) {
    app.service("MergeLocalesService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    return {
        mergeLocales : function (baseLocale, mergeLocale, targetLocale, file) {
            var fd = new FormData();
            fd.append("file", file);
            fd.append("baseLocale", baseLocale);
            fd.append("mergeLocale", mergeLocale);
            fd.append("destLocale", targetLocale);

            return $http.post($window.api_base_url + "v2/foods/admin/merge-locales", fd, {
                transformRequest: angular.identity,
                headers: {"Content-Type": undefined}
            });
        }
    };
}
