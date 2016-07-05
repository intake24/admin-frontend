'use strict';

var config = require('./config')();

module.exports = function (grunt) {
    var stylOptions = {};
    stylOptions[config.stylusTo] = config.stylusFrom;

    grunt.config.set('stylus', {
        dev: {
            options: {
                sourcemap: {
                    inline: true
                }
            },
            files: stylOptions
        },
        prod: {
            files: stylOptions
        }
    });
};