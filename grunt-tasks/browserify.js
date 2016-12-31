'use strict';

var envify = require('envify/custom'),
    pugify = require("pugify"),
    stringify = require("stringify");

module.exports = function (grunt) {

    var config = grunt.config.get('environment'),
        browserifyFileOptions = {};

    browserifyFileOptions[config.browserifyTo] = config.browserifyFrom;

    grunt.config.set('browserify', {
        build: {
            files: browserifyFileOptions,
            options: {
                watch: [config.watchJs],
                browserifyOptions: {
                    debug: config.includeJsMaps
                },
                transform: [envify({
                    API_BASE_URL: config.apiBaseUrl
                }), stringify({
                    appliesTo: {includeExtensions: ['.html']},
                    minify: true
                }), pugify.pug({
                    pretty: false
                })]
            }
        }
    });
};
