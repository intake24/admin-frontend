/**
 * Created by Tim Osadchiy on 23/10/2016.
 */

'use strict';

var SAMPLE_IMAGES = [
    {id: 0, src: 'http://localhost:3002/images/sample1_l.jpg', tags: ['tag1', 'tag2'], deleted: false},
    {id: 1, src: 'http://localhost:3002/images/sample4_l.jpg', tags: ['tag3', 'tag4'], deleted: false},
    {id: 3, src: 'http://localhost:3002/images/sample_10.jpg', tags: ['tag5', 'tag6'], deleted: false},
    {id: 4, src: 'http://localhost:3002/images/sample_10.jpg', tags: ['tag5', 'tag6'], deleted: true},
];

module.exports = function (app) {
    app.service('ImageService', ['$q', '$timeout', serviceFun]);
};

function serviceFun($q, $timeout) {

    return {
        all: function () {
            var deferred = $q.defer();
            deferred.resolve(SAMPLE_IMAGES);

            return deferred.promise;
        },
        restore: function (id) {
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
