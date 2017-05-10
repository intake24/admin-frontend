/**
 * Created by Tim Osadchiy on 23/10/2016.
 */

"use strict";

var _ = require("underscore");

module.exports = function (app) {
    app.service("AsServedSetService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    var BASE_URL = $window.api_base_url + "admin/portion-size/as-served";

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
        getBlankItem: function () {
            return {id: "", description: "", images: []};
        },
        getImageObj: function(id, src) {
            return {sourceId: id, imageUrl: src, weight: 0};
        },
        delete: function (setId) {
            return $http.delete(BASE_URL + "/" + setId);
        }
    }
}
