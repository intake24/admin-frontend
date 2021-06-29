"use strict";

var getFormedUrl = require("../../core/utils/get-formed-url");

module.exports = function (app) {
    app.service("UpdateUKSAService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    return {
        updateUKSA : function () {
            return $http.post($window.api_base_url + "v2/foods/admin/update-uk-sa-psm");
        }
    };
}
