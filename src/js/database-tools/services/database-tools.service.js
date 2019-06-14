/**
 * Created by Tim Osadchiy on 16/02/2017.
 */

"use strict";

var getFormedUrl = require("../../core/utils/get-formed-url");

module.exports = function (app) {
    app.service("DatabaseToolsService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    return {
        list: function () {
            return $http.get("").then(function (data) {
               // return data.map(unpackServerData);
            });
        }
    };
}

