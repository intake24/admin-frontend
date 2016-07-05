'use strict';

var config = require('./config')(),
    envify = require('envify/custom');

module.exports = function (grunt) {
    var browserifyFileOptions = {};
    browserifyFileOptions[config.browserifyTo] = config.browserifyFrom;

    grunt.config.set('browserify', {
        dev: {
            files: browserifyFileOptions,
            options: {
                watch: ['true'],
                browserifyOptions: {
                    debug: true
                },
                transform: [envify({
                    ENVIRONMENT: 'development'
                })]
            }
        },
        prod: {
            files: browserifyFileOptions,
            options: {
                transform: [envify({
                    ENVIRONMENT: 'production'
                })]
            }
        },
				test: {
            files: browserifyFileOptions,
            options: {
                transform: [envify({
                    ENVIRONMENT: 'test'
                })]
            }
        }
    });
};
