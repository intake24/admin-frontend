'use strict';

module.exports = function (grunt) {

    var config = grunt.config.get('environment'),
        jsTask = (config.uglifyJs ? 'uglify' : 'copy:scripts');

    grunt.config.set('watch', {
        stylus: {
            files: [config.stylusWatch],
            tasks: ['stylus', 'cssmin'],
            options: {
                debounceDelay: config.watchDebounceDelay
            }
        },
        scripts: {
            files: config.srcWatch,
            tasks: [jsTask],
            options: {
                debounceDelay: config.watchDebounceDelay
            }
        }
    });

};