'use strict';

module.exports = function (grunt) {

    var config = grunt.config.get('environment'),
        options = {};

    options[config.babelTo] = config.browserifyTo;

    grunt.config.set('babel', {
        options: {
            sourceMap: true,
            presets: ['babel-preset-es2015']
        },
        dist: {
            files: options
        }
    });
};
