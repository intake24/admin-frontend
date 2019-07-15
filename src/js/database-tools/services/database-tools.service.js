"use strict";

var getFormedUrl = require("../../core/utils/get-formed-url");

module.exports = function (app) {
    app.service("DatabaseToolsService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    return {
        exportFoodFrequencies: function (locale, limitToSurveys) {
            var data = JSON.stringify({ locale: locale.id, limitToSurveys: limitToSurveys });
            return $http.post($window.api_base_url + "v2/foods/frequencies", data);
        },

        getRecentTasks: function(type) {
            return $http.get($window.api_base_url + "v2/tasks?type=" + type);
        }
    };
}

