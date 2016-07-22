'use strict';

module.exports = function (grunt) {

    var configPath = grunt.option("config"),
        tskList, config;

    if (!configPath) {
        throw "Path to config file is not provided. Define after --config"
    }

    config = grunt.file.readJSON(configPath);

    grunt.config.set('environment', config);
    grunt.config.set('pkg', grunt.file.readJSON('package.json'));

    require('./grunt-tasks/clean')(grunt);
    require('./grunt-tasks/browserify')(grunt);
    require('./grunt-tasks/copy')(grunt);
    require('./grunt-tasks/stylus')(grunt);
    require('./grunt-tasks/css-minify')(grunt);
    require('./grunt-tasks/uglify')(grunt);
    require('./grunt-tasks/watch')(grunt);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    tskList = ['clean', 'copy:fonts', 'stylus', 'cssmin', 'browserify'];

    if (config.uglifyJs) {
        tskList.push('uglify');
    } else {
        tskList.push('copy:scripts');
    }
    if (config.watchStylus && config.watchJs) {
        tskList.push('watch');
    }
    if (config.watchStylus) {
        tskList.push('watch:stylus');
    }
    if (config.watchJs) {
        tskList.push('watch:scripts');
    }

    grunt.registerTask('default', tskList);
};
