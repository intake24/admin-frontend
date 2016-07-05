'use strict';

module.exports = function (grunt) {
    var config = grunt.config.get('environment'),
        fileOptions = {},
        buildOptions = {};

    fileOptions[config.stylusTo] = config.stylusFrom;

    if (config.includeCssMaps) {
        buildOptions.sourcemap = {inline: true};
    }

    grunt.config.set('stylus', {
        build: {
            options: buildOptions,
            files: fileOptions
        }
    });
};