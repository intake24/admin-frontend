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
    app.service("ImageService", ["$http", "$httpParamSerializerJQLike", "$q", "$timeout", serviceFun]);
};

function serviceFun($http, $httpParamSerializerJQLike, $q, $timeout) {

    return {
        query: function(offset, limit, search) {
            var url = "http://api-test.intake24.co.uk/admin/images/source",
                params = {offset: offset, limit: limit};
            if (search) {
                params.search = search;
            }
            return $http.get(url+"?"+$httpParamSerializerJQLike(params))
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
