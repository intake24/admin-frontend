/**
 * Created by Tim Osadchiy on 23/10/2016.
 */

"use strict";

var SAMPLE_ITEMS = [
    {
        id: "Set 1", description: "Lorem ipsum", deleted: false, images: [
        {
            id: 0,
            src: "http://localhost:3002/images/sample1_l.jpg",
            tags: ["tag1", "tag2"],
            weight: 550.5,
            deleted: false
        },
        {id: 1, src: "http://localhost:3002/images/sample4_l.jpg", tags: ["tag3", "tag4"], weight: 220, deleted: false},
    ]
    },
    {
        id: "Set 2", description: "Lorem ipsum", deleted: false, images: [
        {id: 3, src: "http://localhost:3002/images/sample_10.jpg", tags: ["tag5", "tag6"], weight: 100, deleted: false},
        {
            id: 4,
            src: "http://localhost:3002/images/sample_10.jpg",
            tags: ["tag5", "tag6"],
            weight: 900.32,
            deleted: true
        }
    ]
    }
];

var _ = require("underscore");

module.exports = function (app) {
    app.service("AsServedSetService", ["$q", "$http", "$timeout", serviceFun]);
};

function serviceFun($q, $http, $timeout) {

    return {
        all: function () {
            return $http.get("http://api-test.intake24.co.uk/admin/portion-size/as-served").then(function (data) {
                return _.map(data, function(el) {
                   return el;
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
