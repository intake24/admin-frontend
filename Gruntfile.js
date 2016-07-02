'use strict';

module.exports = function (grunt) {
    var fontsCopyFrom = ['node_modules/font-awesome/fonts/*', 'node_modules/bootstrap/dist/fonts/*'],
        fontsCopyTo = '../static/fonts/',

        templatesFrom = 'ng-templates/**/*.html',
        templatesTo = 'js/classroom-templates.js',

        stylFrom = 'src/styl/style.styl',
        stylTo = 'public/style.min.css',

        browserifyFrom = 'src/js/intake24-admin.js',
        browserifyTo = 'public/intake24-admin.js',

        jsConcatFrom = [browserifyTo, templatesTo],
        jsConcatTo = '../static/js/classroom.js',

        uglifyTo = 'public/intake24-admin.min.js',

        cssMinFileOptions = {
            '../static/css/style.min.css': ['node_modules/font-awesome/css/font-awesome.min.css',
                'node_modules/bootstrap/dist/css/bootstrap.min.css',
                'css/group-spinner.min.css']
        };

    var stylOptions = {};
    stylOptions[stylTo] = stylFrom;

    var browserifyFileOptions = {};
    browserifyFileOptions[browserifyTo] = browserifyFrom;

    var uglifyJsFileOptions = {};
    uglifyJsFileOptions[uglifyTo] = browserifyTo;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        stylus: {
            compile: {
                options: {
                    sourcemap: {
                        inline: true
                    }
                },
                files: stylOptions
            }
        },
        browserify: {
            dist: {
                files: browserifyFileOptions,
                options: {
                    watch: ['true'],
                    browserifyOptions: {
                        debug: true
                    },
                }
            }
        },
        //concat: {
        //    options: {
        //        separator: ';'
        //    },
        //    classroomJs: {
        //        src: jsConcatFrom,
        //        dest: jsConcatTo
        //    }
        //},
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: uglifyJsFileOptions
            }
        },
        //cssmin: {
        //    options: {
        //        shorthandCompacting: false,
        //        roundingPrecision: -1
        //    },
        //    target: {
        //        files: cssMinFileOptions
        //    }
        //},
        watch: {
            stylus: {
                files: ['src/styl/*'],
                tasks: ['stylus'],
                options: {
                    debounceDelay: 5000
                }
            },
            scripts: {
                files: [browserifyTo],
                tasks: ['uglify'],
                options: {
                    debounceDelay: 5000
                }
            }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-clean');
    //grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-browserify');
    //grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['stylus', 'browserify', 'uglify', 'watch']);
};