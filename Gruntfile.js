'use strict';

module.exports = function (grunt) {

    grunt.config.set('pkg', grunt.file.readJSON('package.json'));

    require('./grunt-tasks/browserify')(grunt);
    require('./grunt-tasks/copy')(grunt);
    require('./grunt-tasks/stylus')(grunt);
    require('./grunt-tasks/uglify')(grunt);
    require('./grunt-tasks/watch')(grunt);

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('dev', ['stylus:dev', 'browserify:dev', 'copy:dev', 'watch']);
    grunt.registerTask('default', ['stylus:prod', 'browserify:prod', 'uglify:prod']);
};