'use strict';

var config = require('./config')();

module.exports = function (grunt) {
    var uglifyJsFileOptions = {};
    uglifyJsFileOptions[config.buildJsTo] = config.browserifyTo;

    grunt.config.set('uglify', {
        options: {
            // the banner is inserted at the top of the output
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        prod: {
            files: uglifyJsFileOptions
        }
    });
};