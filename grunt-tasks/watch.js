'use strict';

var config = require('./config')();

module.exports = function (grunt) {

    grunt.config.set('watch', {
        stylus: {
            files: [config.stylusWatch],
            tasks: ['stylus:dev'],
            options: {
                debounceDelay: 5000
            }
        },
        scripts: {
            files: [config.browserifyTo],
            tasks: ['copy:dev'],
            options: {
                debounceDelay: 5000
            }
        }
    });

};