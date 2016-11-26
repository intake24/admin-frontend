/**
 * Created by Tim Osadchiy on 23/10/2016.
 */

"use strict";

var _ = require("underscore");

module.exports = function (app) {
    app.service("AsServedSetService", ["$q", "$http", "$timeout", serviceFun]);
};

function serviceFun($q, $http, $timeout) {

    var BASE_URL = "http://api-test.intake24.co.uk/admin/portion-size/as-served";

    return {
        all: function () {
            return $http.get(BASE_URL).then(function (data) {
                return _.map(data, function (el) {
                    return el;
                }).sort(function (a, b) {
                    if (a.id.toLowerCase() > b.id.toLowerCase()) {
                        return 1;
                    } else if (a.id.toLowerCase() < b.id.toLowerCase()) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            });
        },
        get: function (id) {
            return $http.get(BASE_URL + "/" + id);
        },
        add: function (id, description, images) {
            return $http.post(BASE_URL + "/new-from-source", {
                id: id,
                description: description,
                images: images
            });
        },
        patch: function(id, newId, newDescription, images) {
            return $http.put(BASE_URL + "/" + id, {
                id: newId,
                description: newDescription,
                images: images
            });
        },
        generateBlankItem: function () {
            return {id: "", description: "", images: []};
        },
        generateBlankImage: function(id, src) {
            return {sourceId: id, imageUrl: src, weight: 0};
        },
        remove: function (setId) {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve();
            }, Math.random() * 500);
            return deferred.promise;
        }
    }
}
