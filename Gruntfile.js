/**
 @toc
 2. load grunt plugins
 3. init
 4. setup variables
 5. grunt.initConfig
 6. register grunt tasks

 */

'use strict';

module.exports = function (grunt) {

  /**
   Load grunt plugins
   @toc 2.
   */
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');

  /**
   Function that wraps everything to allow dynamically setting/changing grunt options and config later by grunt task. This init function is called once immediately (for using the default grunt options, config, and setup) and then may be called again AFTER updating grunt (command line) options.
   @toc 3.
   @method init
   */
  function init(params) {
    var files=require('./files').files;
    /**
     Project configuration.
     @toc 5.
     */
    grunt.initConfig({
      concat: {
        options: {},
        dist: {
          src: files.src,
          dest: 'build/ct-ui-router-extras.js'
        }
      },
      jshint: {
        options: {
          //force:          true,
          globalstrict: true,
          //sub:            true,
          node: true,
          loopfunc: true,
          browser: true,
          devel: true,
          globals: {
            angular: false,
            $: false,
            moment: false,
            Pikaday: false,
            module: false,
            forge: false
          }
        },
        beforeconcat: {
          options: {
            force: false,
            ignores: ['**.min.js']
          },
          files: {
            src: []
          }
        },
        //quick version - will not fail entire grunt process if there are lint errors
        beforeconcatQ: {
          options: {
            force: true,
            ignores: ['**.min.js']
          },
          files: {
            src: ['**.js']
          }
        }
      },
      uglify: {
        options: {
          mangle: false
        },
        build: {
          files: {},
          src: 'build/ct-ui-router-extras.js',
          dest: 'build/ct-ui-router-extras.min.js'
        }
      },
      karma: {
        options: {
          configFile: 'test/karma.conf.js',
          singleRun: true,
          exclude: [],
          frameworks: ['jasmine'],
          reporters: 'dots', // 'dots' || 'progress'
          port: 8080,
          colors: true,
          autoWatch: false,
          autoWatchInterval: 0,
          browsers: [ grunt.option('browser') || 'PhantomJS' ]
        },
        unit: {
          configFile: 'test/karma.dev.conf.js',
          singleRun: true,
          browsers: [ grunt.option('browser') || 'PhantomJS' ]
        },
        build: {
          configFile: 'test/karma.build.conf.js',
          singleRun: true,
          browsers: [ grunt.option('browser') || 'PhantomJS' ]
        },
        min: {
          configFile: 'test/karma.min.conf.js',
          singleRun: true,
          browsers: [ grunt.option('browser') || 'PhantomJS' ]
        },
        watch: {
          configFile: 'test/karma.conf.js',
          browsers: [ grunt.option('browser') || 'PhantomJS' ],
          singleRun: false,
          autoWatch: true,
          autoWatchInterval: 1
        },
        debug: {
          singleRun: false,
          background: false,
          browsers: [ grunt.option('browser') || 'Chrome' ]
        }
      }
    });


    /**
     register/define grunt tasks
     @toc 6.
     */
      // Default task(s).
    grunt.registerTask('default', ['jshint:beforeconcatQ', 'concat', 'uglify:build', 'karma:build', 'karma:min']);
    grunt.registerTask('test', ['jshint:beforeconcatQ', 'karma:unit']);
    grunt.registerTask('test:watch', ['jshint:beforeconcatQ', 'karma:watch']);

  }

  init({});		//initialize here for defaults (init may be called again later within a task)

};
