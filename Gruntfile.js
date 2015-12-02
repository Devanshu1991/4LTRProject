'use strict';

var _ = require('lodash');

var desireds = require('./desireds');
var runner = require('./runconfig');
var run_env = require('./envconfig');

var gruntConfig = {
        env: {
            // dynamically filled
        },
        simplemocha: {
            sauce: {
                options: {
                    timeout: 90000,
                    reporter: 'spec'
                },


                src: ['test/sauce/sanity/courseCreationAndAssignmentCreationVerification.js'
                // 'test/sauce/assessmentTypeAssignmentFeature/*.js',
                // 'test/sauce/chapterReadingAssignmentFeatur/*.js',
                // 'test/sauce/contentFeature/*.js',
                // 'test/sauce/contentFeature/*.js',
                // 'test/sauce/courseActions/*.js',
                // 'test/sauce/flashcardsFeature/*.js',
                // 'test/sauce/genericValidations/*.js',
                // 'test/sauce/gradebookFeature/*.js',
                // 'test/sauce/navigationFeature/*.js',
                // 'test/sauce/notesFeature/*.js',
                // 'test/sauce/practiceQuizFeature/*.js',
                // 'test/sauce/studyBitsFeature/*.js',
                // 'test/sauce/studyBoardFeature/*.js'
                ]


            }
        }, 
        
         jshint: {
        options: {
            reporter: require('jshint-html-reporter'),
            reporterOutput: 'jshint-report.html'
        },
        target: ['file.js']
	    },

    
        // jshint: {
            // options: {
                // jshintrc: '.jshintrc'
            // },
            // gruntfile: {
                // src: 'Gruntfile.js'
            // },
            // test: {
                // options: {
                    // jshintrc: 'test/.jshintrc'
                // },                
                // src: ['test/**/*.js']
            // }
        // },
        concurrent: {
            'test-sauce': []// dynamically filled
        },
        
        // protractor_install: {
        // command: 'node ./node_modules/protractor/bin/webdriver-manager update'
      // },
//       
      // npm_install: {
        // command: 'npm install'
      // },
      
      // protractor: {
      // options: {
        // keepAlive: true,
        // configFile: "protractor.conf.js"
      // },
       // singlerun: {},
      // auto: {
        // keepAlive: true,
        // options: {
          // args: {
            // seleniumPort: 4444
          // }
        // }
      // }
     // },
            
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test']
            }
        }
    };
    

 
_(desireds).each(function(desired, key) {
    gruntConfig.env[key] = { 
        DESIRED: JSON.stringify(desired),
        RUNNER: JSON.stringify(runner),
        RUN_ENV: JSON.stringify(run_env)
    };



    gruntConfig.concurrent['test-sauce'].push('test:sauce:' + key);
});

//console.log(gruntConfig);

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig(gruntConfig);
    	 
    
   

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['jshint']);
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.registerTask('test:e2e', ['protractor:singlerun']);
    // grunt.registerTask('install', ['update','shell:protractor_install']);
	// grunt.registerTask('update', ['shell:npm_install']);

    // Default task.
    grunt.registerTask('default', ['test:sauce:' + _(desireds).keys().first()]);

    _(desireds).each(function(desired, key) {
            grunt.registerTask('test:sauce:' + key, ['env:' + key, 'simplemocha:sauce']);
    });

    grunt.registerTask('test:sauce:parallel', ['concurrent:test-sauce']);
    
    
};
