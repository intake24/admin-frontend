/**
 * Created by Tim Osadchiy on 23/10/2016.
 */

"use strict";

var _ = require("underscore");

module.exports = function (app) {
    app.service("AsServedSetService", ["$q", "$http", "$timeout", serviceFun]);
};

function serviceFun($q, $http, $timeout) {

    return {
        all: function () {
            return $http.get("http://api-test.intake24.co.uk/admin/portion-size/as-served").then(function (data) {
                return _.map(data, function (el) {
                    return el;
                }).sort(function (a, b) {
                    if (a.id.toLowerCase() > b.id.toLowerCase()) {
                        return 1;
                    } else if (a.id.toLowerCase() < b.id.toLowerCase()){
                        return -1;
                    } else {
                        return 0;
                    }
                });
            });
        },
        add: function (setId, description) {
            var deferred = $q.defer();
            var newItem = {id: setId, description: description, images: [], deleted: false};
            $timeout(function () {
                deferred.resolve(newItem);
            }, Math.random() * 500);
            return deferred.promise;
        },
        generateBlankItem: function () {
            return {id: "", description: "", images: [], deleted: false};
        },
        edit: function (setId, description) {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve();
            }, Math.random() * 500);
            return deferred.promise;
        },
        remove: function (setId) {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve();
            }, Math.random() * 500);
            return deferred.promise;
        },
        restore: function (setId) {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve();
            }, Math.random() * 500);
            return deferred.promise;
        }
    }
}
