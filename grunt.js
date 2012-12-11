/*global module:false*/
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-compass');
  // Project configuration.
  grunt.initConfig({
    watch: [{
      files: ['src/coffee/templates/**/*.ejs'],
      tasks: 'jst'
    },{
      files:["src/scss/**/*.scss"],
      tasks: 'compass:dev'
    },{
      files:["src/coffee/**/*.coffee"],
      tasks: 'coffee'
    }],
    coffee: {
      compile: {
        files: {
          'js/app.js': ['src/coffee/*.coffee', 'src/coffee/**/*.coffee']
        }
      }
    },
    server: {
      port: 8888,
      base: '.'
    },
    compass:{
      dev: {
        config: './config.rb'
      }
    },
    concat:{
      libs:{
        src:['lib/js/jquery.min.js','lib/js/underscore-min.js','lib/js/backbone-min.js','lib/js/backbone.marionette.min.js','lib/js/d3.v2.min.js'],
        dest: "js/libs.js"
      }
    },
    jst:{
      compile:{
        files: {
          "js/templates.js": ["src/coffee/templates/**/*.ejs"]
        },
        options: {
          processName: function(filename) {
            return filename.replace("src/coffee/templates/", "");
          }
        }
      }
    }

  });

  // Default task.
  grunt.registerTask('default', 'server watch');

};
