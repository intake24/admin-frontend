/**
 * Created by Tim Osadchiy on 23/10/2016.
 */

'use strict';

var SAMPLE_ITEMS = [
    {id: 0, src: 'http://localhost:3002/images/sample1_l.jpg', tags: ['tag1', 'tag2'], weight: 550.5, deleted: false},
    {id: 1, src: 'http://localhost:3002/images/sample4_l.jpg', tags: ['tag3', 'tag4'], weight: 220, deleted: false},
    {id: 3, src: 'http://localhost:3002/images/sample_10.jpg', tags: ['tag5', 'tag6'], weight: 100, deleted: false},
    {id: 4, src: 'http://localhost:3002/images/sample_10.jpg', tags: ['tag5', 'tag6'], weight: 900.32, deleted: true},
];

module.exports = function (app) {
    app.service('AsServedService', ['$q', '$timeout', serviceFun]);
};

function serviceFun($q, $timeout) {

    return {
        all: function () {
            var deferred = $q.defer();
            deferred.resolve(SAMPLE_ITEMS);

            return deferred.promise;
        },
        generateNewItem: function (imgSrc, imgTags) {
            return {id: undefined, src: imgSrc, tags: imgTags, weight: 0, deleted: false};
        },
        add: function (imgId, weight) {
            var deferred = $q.defer();
            var newItem = {
                id: 5,
                src: 'http://localhost:3002/images/sample1_l.jpg',
                tags: ['some', 'tag'],
                weight: weight,
                deleted: false
            };
            $timeout(function () {
                deferred.resolve(newItem);
            }, Math.random() * 500);
            return deferred.promise;
        },
        edit: function (itemId, imgId, weight) {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve();
            }, Math.random() * 500);
            return deferred.promise;
        },
        remove: function (id) {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve();
            }, Math.random() * 500);
            return deferred.promise;
        }
    }
}
