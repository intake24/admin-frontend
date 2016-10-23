'use strict';

module.exports = function (grunt) {

    var config = grunt.config.get('environment'),
        jsTask = (config.uglifyJs ? 'uglify' : 'concat');

    grunt.config.set('watch', {
        templates: {
            files: [config.galleryTemplatesSrc],
            tasks: ['ngtemplates', jsTask],
            options: {
                debounceDelay: 5000
            }
        },
        stylus: {
            files: [config.stylusWatch],
            tasks: ['stylus', 'cssmin'],
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