'use strict';

var _ = require('lodash');

var desireds = require('./desireds');
var runner = require('./runconfig');

var gruntConfig = {
    env: {
        options:{


        }
    },
    simplemocha: {
        ltr: {
            options: {
                timeout: 60000,
                captureFile: 'reports.xml',
                reporter: 'spec'

            },


            src: ['test/sauce/sanity/studentCreat*.js','test/sauce/sanity/studentAssign*.js']



        }
    },
    jshint: {
        options: {
            jshintrc: '.jshintrc'
        },
        gruntfile: {
            src: 'Gruntfile.js'
        },
        test: {
            options: {
                jshintrc: 'test/.jshintrc'
            },
            src: ['test/**/*.js']
        }
    },
    concurrent: {
        'test-sauce': []// dynamically filled
    },
    watch: {
        gruntfile: {
            files: '<%= jshint.gruntfile.src %>',
            tasks: ['jshint:gruntfile']
        },
        test: {
            files: '<%= jshint.test.src %>',
            tasks: ['jshint:test']
        }
    },

    exec: {
        generate_report: {
            cmd: function(firstName, lastName) {
                return 'xmljade -o reportjade.html report.jade jadexml.xml';
            }
        }
    }


};



//console.log(gruntConfig);

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig(gruntConfig);

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');

    var target = grunt.option('target') || 'staging';
    var product = grunt.option('product') || 'default';
    var course = grunt.option('course') || 'default';
    var student_userid = grunt.option('student_userid') || 'default';
    var instructor_userid = grunt.option('instructor_userid') || 'default';
    var coursekey = grunt.option('coursekey') || 'default';
    var cs = grunt.option('cs') || 'no';
    var rc = grunt.option('rc') || 'no';
    var sel_grid = grunt.option('grid') || 'http://127.0.0.1:4444/wd/hub';
    var browser = grunt.option('browser') || 'chrome';
    gruntConfig.env.common = {

        RUNNER: JSON.stringify(runner),
        RUN_ENV: JSON.stringify(target),
        RUN_IN_GRID: JSON.stringify(sel_grid),
        RUN_IN_BROWSER:JSON.stringify(browser),
        RUN_FOR_PRODUCT: JSON.stringify(product),
        RUN_FOR_COURSE: JSON.stringify(course),
        RUN_FOR_STUDENT_USERID: JSON.stringify(student_userid),
        RUN_FOR_INSTRUCTOR_USERID: JSON.stringify(instructor_userid),
        RUN_FOR_COURSEKEY:JSON.stringify(coursekey),
        CREATE_STUDENT: JSON.stringify(cs),
        REGISTER_COURSE:JSON.stringify(rc)
    };


    grunt.registerTask('default', ['env:common','simplemocha:ltr']);
};
