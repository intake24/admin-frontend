/**
 * Created by Tim Osadchiy on 23/10/2016.
 */

'use strict';

var SAMPLE_IMAGES = [
  {id: 0, src: 'http://imgsv.imaging.nikon.com/lineup/lens/zoom/normalzoom/af-s_dx_18-300mmf_35-56g_ed_vr/img/sample/sample4_l.jpg', tags: ['tag1', 'tag2']},
  {id: 1, src: 'http://imgsv.imaging.nikon.com/lineup/lens/zoom/normalzoom/af-s_dx_18-140mmf_35-56g_ed_vr/img/sample/sample1_l.jpg', tags: ['tag3', 'tag4']},
  {id: 3, src: 'http://www.ricoh.com/r_dc/r/r8/img/sample_10.jpg', tags: ['tag5', 'tag6']},
];

module.exports = function (app) {
    app.service('ImageService', ['$q', serviceFun]);
};

function serviceFun($q) {

    return {
        all: function () {
            var deferred = $q.defer();

            deferred.resolve(SAMPLE_IMAGES);

            return deferred.promise;
        }
    }
}
