/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

module.exports = function (grunt) {
    var config = grunt.config.get('environment');

    grunt.config.set('ngtemplates', {
        intakeGallery: {
            options: {
                module: "intake24.gallery"
            },
            src: config.galleryTemplatesSrc,
            dest: config.galleryTemplatesDest
        },
    });
};
