'use strict';

module.exports = function (grunt) {

    var config = grunt.config.get('environment');

    grunt.config.set('copy', {
        scripts: {
            src: config.browserifyTo,
            dest: config.buildJsTo
        },
        fonts: {
            expand: true,
            flatten: true,
            src: config.copyFontsFrom,
            dest: config.copyFontsTo,
            filter: 'isFile'
        }
    });
};