'use strict';

var config = require('./config')();

module.exports = function (grunt) {
    grunt.config.set('copy', {
        dev: {
            src: config.browserifyTo,
            dest: config.buildJsTo
        }
    });
};