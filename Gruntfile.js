// Generated on 2015-01-23 using generator-angular 0.10.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: 'ulearn5/js/app',
    dist: '../ulearn5.theme/src/ulearn5/theme/theme/angular/dist',
    egg: 'ulearn5/js'
  };

  var config_file = 'ulearn5/js/config.json';
  var resource_config = grunt.file.readJSON(config_file);
  var uglify_options = {
      sourceMap: true,
      banner: '/*! <%= uglify.pkg.name %> - v<%= uglify.pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */'
  };
  grunt.loadNpmTasks('grunt-ng-annotate');
  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    replace: {
      build: {
        src: ['<%= yeoman.egg %>/browser/viewlets_templates/gwjsdevelviewlet.pt'],
        dest: '<%= yeoman.egg %>/browser/viewlets_templates/gwjsproductionviewlet.pt',
        replacements: [{
          from: 'tal:attributes="src string:${portal_url}/++components++ulearn',
          to: 'src="ulearn5/js/components'
        },
        {
          from: 'tal:attributes="src string:${portal_url}/++ulearn++js',
          to: 'src="ulearn5/js/legacy'
        },
        {
          from: 'tal:attributes="src string:${portal_url}/++ulearn++app',
          to: 'src="ulearn5/js/app'
        },
        {
          from: 'condition="viewlet/is_devel_mode"',
          to: 'condition="not: viewlet/is_devel_mode"'
        },
        ]
      },
      postbuild: {
        src: ['<%= yeoman.egg %>/browser/viewlets_templates/gwjsproductionviewlet.pt'],
        overwrite: true,
        replacements: [{
          from: 'src="js',
          to: 'tal:attributes="src string:${portal_url}/++ulearn5++dist/js'
        },
        ]
      }
    },
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        options: {force: true},
        files: [{
          dot: true,
          src: [
            '.tmp',
            // '<%= yeoman.dist %>/{,*/}*',
            '<%= yeoman.dist %>/ulearn5.common.{,*}*.js',
            '<%= yeoman.dist %>/ulearn5.app.{,*}*.js',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      },
      build: {
        src: [
          '<%= yeoman.dist %>/ulearn5.common.js',
          '<%= yeoman.dist %>/ulearn5.app.js'
        ]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    uglify: {
      pkg: grunt.file.readJSON('package.json'),
      common: {
         options: uglify_options,
         files: {
             '<%= yeoman.dist %>/ulearn5.common.js': '.tmp/ulearn5.common.js'
        }
      },
      app: {
         options: uglify_options,
         files: {
             '<%= yeoman.dist %>/ulearn5.app.js': '.tmp/ulearn5.app.js'
        }
      }
    },

    concat: {
      options: {},
      common: { files: {'.tmp/ulearn5.common.js': resource_config.resources.common.js.development }},
    },

    ngAnnotate: {
      options: {
          ngAnnotateOptions: {}
      },
      app: { files: {'.tmp/ulearn5.app.js': resource_config.resources.app.js.development }},
    },

    // Copies remaining files to places other tasks can use
    copy: {
      build: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*'
          ]
        },
        ]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }

  });

  grunt.registerTask('updateconfig', function () {
    if (!grunt.file.exists(config_file)) {
        grunt.log.error('file ' + config_file + ' not found');
        return true; //return false to abort the execution
    }

    resource_config.revision_info = grunt.filerev.summary; //edit the value of json object, you can also use projec.key if you know what you are updating

    grunt.file.write(config_file, JSON.stringify(resource_config, null, 2)); //serialize it back to file

  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('gwbuild', [
    'ngAnnotate',
    'concat',
    'uglify',
    'filerev:build',
    'updateconfig'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
