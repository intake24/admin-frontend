'use strict';

module.exports = function (grunt) {
    var config = grunt.config.get('environment');

    grunt.config.set('clean', {
        fonts: {
            options: {
                force: true
            },
            src: [config.copyFontsTo]
        }
    });
};