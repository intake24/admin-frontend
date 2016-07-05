'use strict';

module.exports = function (grunt) {

    var config = grunt.config.get('environment'),
        jsTask = (config.uglifyJs ? 'uglify' : 'copy:scripts');

    console.log(config.browserifyTo);

    grunt.config.set('watch', {
        stylus: {
            files: [config.stylusWatch],
            tasks: ['stylus'],
            options: {
                debounceDelay: config.watchDebounceDelay
            }
        },
        scripts: {
            files: [config.browserifyTo],
            tasks: [jsTask],
            options: {
                debounceDelay: config.watchDebounceDelay
            }
        }
    });

};