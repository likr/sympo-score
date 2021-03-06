var path = require('path');

module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      install: {
        options: {
          targetDir: 'app/static',
          layout: function(type) {
            var renamedType = type;
            if (type === 'js' || type === 'map') {
              renamedType = 'scripts';
            } else if (type === 'css') {
              renamedType = 'styles';
            }
            return path.join(renamedType, 'lib');
          }
        }
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commit: false,
        createTag: false,
        push: false
      }
    },
    concat: {
      dist: {
        src: [
          'build/sympo-score.js',
          'build/services/*.js',
          'build/directives/*.js',
          'build/filters/*.js',
          'build/controllers/*.js'
        ],
        dest: 'app/static/scripts/sympo-score.js'
      }
    },
    traceur: {
      options: {
        modules: 'inline'
      },
      src: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.js'],
            dest: 'build'
          }
        ]
      }
    },
    watch: {
      src: {
        files: ['src/**/*.js'],
        tasks: ['build']
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-traceur');

  grunt.registerTask('build', ['traceur', 'concat']);
  grunt.registerTask('default', ['build']);
};
