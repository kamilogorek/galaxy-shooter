// Generated on 2013-09-17 using generator-webapp 0.4.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'app/*.html',
                    'app/styles/*.css',
                    'app/scripts/*.js',
                    'app/images/*.{png,jpg,jpeg,gif,webp,svg}',
                    'app/sounds/*.{mp3,ogg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: 'app'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'app/scripts/*.js'
            ]
        },
        requirejs: {
            compile: {
                options: {
                    appDir: './app/scripts/',
                    baseUrl: '.',
                    dir: './dist/scripts/',
                    modules: [{ name: 'main' }],
                    findNestedDependencies: true,
                    optimize: 'uglify',
                    preserveLicenseComments: true,
                    removeCombined: true
                }
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/images',
                    src: '*.{png,jpg,jpeg}',
                    dest: 'dist/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    'dist/styles/main.css': [ 'app/styles/*.css' ]
                }
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'app',
                    dest: 'dist',
                    src: [
                        './*.{html,ico}',
                        'sounds/*'
                    ]
                }]
            }
        }
    });

    grunt.registerTask('server', [
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', [
        'jshint',
        'requirejs',
        'imagemin',
        'cssmin',
        'copy:dist'
    ]);

    grunt.registerTask('default', [
        'server'
    ]);
};
