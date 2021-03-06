'use strict';

module.exports = function (grunt) {

    var config = grunt.config.get('environment'),
        uglifyJsFileOptions = {};

    uglifyJsFileOptions[config.buildJsTo] = [config.babelTo];

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