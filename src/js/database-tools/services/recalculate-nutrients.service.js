"use strict";

var getFormedUrl = require("../../core/utils/get-formed-url");

module.exports = function (app) {
    app.service("RecalculateNutrientsService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    return {
        recalculateNutrients: function (targetSurveyId) {
            return $http.post($window.api_base_url + "v2/surveys/" + targetSurveyId + "/recalculate-nutrients");
        }
    };
}
