/**
 * Created by Tim Osadchiy on 23/10/2016.
 */

'use strict';

var ImageModel = require("../models/image-model");

var SAMPLE_IMAGES = [
  {id: 0, src: 'http://localhost:3002/images/sample1_l.jpg', tags: ['tag1', 'tag2']},
  {id: 1, src: 'http://localhost:3002/images/sample4_l.jpg', tags: ['tag3', 'tag4']},
  {id: 3, src: 'http://localhost:3002/images/sample_10.jpg', tags: ['tag5', 'tag6']},
];

module.exports = function (app) {
    app.service('ImageService', ['$q', '$timeout', serviceFun]);
};

function serviceFun($q, $timeout) {

    return {
        all: function () {
            var deferred = $q.defer(),
                result = SAMPLE_IMAGES.map(function(image) {
                    return new ImageModel(image.id, image.src, image.tags);
                });

            deferred.resolve(result);

            return deferred.promise;
        },
        remove: function(id) {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve();
            }, Math.random() * 500);
            return deferred.promise;
        }
    }
}
