/*global module:false*/
module.exports = function(grunt) {

    var packagejson = grunt.file.readJSON('package.json');
    // Project configuration.
    grunt.initConfig({
      // Metadata.
      pkg: packagejson,
      banner: '/*\n * <%= pkg.title || pkg.name %> v<%= pkg.version %> | JavaScript Heatmap Library\n *\n * Copyright 2008-2016 Patrick Wied <heatmapjs@patrick-wied.at> - All rights reserved.\n * Dual licensed under MIT and Beerware license \n *\n * :: <%= grunt.template.today("yyyy-mm-dd HH:MM") %>\n */\n',
      // Task configuration.
      concat: {
        options: {
          banner: '<%= banner %>'+';(function (name, context, factory) {\n\n  // Supports UMD. AMD, CommonJS/Node.js and browser context\n  if (typeof module !== "undefined" && module.exports) {\n    module.exports = factory();\n  } else if (typeof define === "function" && define.amd) {\n    define(factory);\n  } else {\n    context[name] = factory();\n  }\n\n})("h337", this, function () {\n',
          footer: '\n\n});'
        },
        dist: {
          src: packagejson.buildFiles,
          dest: 'build/heatmap.js'
        }
      },
      uglify: {
        options: {
          banner: '<%= banner %>',
          mangle: true,
          compress: false, //compress must be false, otherwise behaviour change!!!!!
          beautify: false
        },
        dist: {
          src: 'build/heatmap.js',
          dest: 'build/heatmap.min.js'
        }
      },
      /* css start */
      cssmin: {
        options: {
          keepSpecialComments: 1,
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          // 美化代码
          beautify: {
              // 防止乱码
              ascii_only: true
          }
        },
        combine:{
          fiels:{
            'dist/styles/common.min.css': ['src/styles/layout-*.css'],
            'dist/styles/index.min.css': ['src/styles/common.css', 'src/styles/header.css'],
          }
        }
      },
      /* css end */
      /* jslint start */
      jshint: {
        options: {
            curly: true,
            newcap: true,
            eqeqeq: true,
            noarg: true,
            sub: true,
            undef: true,
            camelcase: true,
            freeze: true,
            quotmark: true,
            browser: true,
            devel: true,
            globals: {
                PUBLIC: false,
                escape: false,
                unescape: false,
                // grunt
                module: false,
                // jasmine
                it: false,
                xit: false,
                describe: false,
                xdescribe: false,
                beforeEach: false,
                afterEach: false,
                expect: false,
                spyOn: false,
                // requireJs
                define: false,
                require: false,
                requirejs: false
            }
        },
        files: {
          src: [
            './src/*/*.js'
          ]
        }
      },
      /* jslint end */

      watch: {
        gruntfile: {
          files: '<%= jshint.gruntfile.src %>',
          tasks: ['jshint:gruntfile']
        },
        dist: {
          files: packagejson.buildFiles,
          tasks: ['concat', 'jshint', 'uglify']
        }
      }
    });
  
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
  
  
    // Default task.
    grunt.registerTask('default', ['jshint', 'cssmin']);
  };