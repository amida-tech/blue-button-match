/*global module*/

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsbeautifier');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      files: ['*.js', './lib/*.js', './test/*.js'],
      options: {
        browser: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        boss: true,
        eqnull: true,
        node: true,
        expr: true,
        globals: {
          'it': true,
          'describe': true,
          'expect': true,
          'before': true,
          'after': true,
          'done': true
        }
      }
    },
    watch: {
      all: {
        files: ['./lib/*.js', '*.js', './test/*.js'],
        tasks: ['default']
      }
    },
    run: {
      test: {
        exec: 'npx jest'
      },
      coverage: {
        exec: 'npx jest --coverage'
      }
    },
    jsbeautifier: {
      beautify: {
        src: ['Gruntfile.js', 'lib/*.js', 'lib/**/*.js', 'test/*.js', 'test/**/*.js', 'index.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      check: {
        src: ['Gruntfile.js', 'lib/*.js', 'lib/**/*.js', 'test/*.js', 'test/**/*.js', 'index.js'],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'test', 'beautify']);
  grunt.registerTask('commit', ['jshint', 'test', 'beautify']);
  grunt.registerTask('test', ['run:test']);
  grunt.registerTask('coverage', ['run:coverage']);
  grunt.registerTask('beautify', ['jsbeautifier:beautify']);
  grunt.registerTask('timestamp', function () {
    grunt.log.subhead(Date());
  });

};
