/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

module.exports = function (grunt) {
    var config = grunt.config.get('environment');

    grunt.config.set('concat', {
        options: {
            separator: ';'
        },
        intakeGallery: {
            src: [config.browserifyTo, config.galleryTemplatesDest],
            dest: config.buildJsTo
        },
    });
};