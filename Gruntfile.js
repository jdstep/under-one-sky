module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    
    jshint: {
      all: [
      'Gruntfile.js', 
      'client/**/*.js', 
      'server/**/*.js',
      '!client/lib/**/*.js', 
      '!client/services/countrycodes.js', 
      '!client/services/googleanalytics.js'
      ]
    },
    concat: {
      options: {
        seperator: ';'
      },
      dist: {
        src: ['client/app/app.js', 'client/helpers/**/*.js', 'client/services/**/*.js'],
        dest: 'public/js/sky.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'public/js/sky.min.js': ['public/js/sky.js']
        }
      },
      options: {
        mangle: false,
      },
    },
    htmlmin: {                                     
      dist: {                                      
        options: {                                 
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'public/index.html': 'client/index.html',     // 'destination': 'source'
        }
      },
    },
    copy: {
      html: {
        files: [
          { src: 'client/index.html', dest: 'public/index.html'}
        ]
      },
      main : {
        files: [
          {expand: true, src: ['client/lib/images/*'], flatten: true, dest: 'public/images', filter: 'isFile'},
          {expand: true, src: ['client/*.png'], dest: 'public/', filter: 'isFile'},
          {expand: true, src: ['client/*.ico'], dest: 'public/', filter: 'isFile'},
          {expand: true, src: ['client/*.ico'], dest: 'public/', filter: 'isFile'},
          {expand: true, cwd: 'client/js', src: ['**'], dest: 'public/js'} 
        ]
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/styles/styles.css': ['client/styles/styles.css']
        }
      }
    },
    clean: ["public/"],
    purifycss: {
      options: {},
      target: {
        src: ['client/index.html', 'client/app/**/*.js'],
        css: ['client/styles/bootstrap.min.css'],
        dest: 'public/styles/bootstrap-purified.css'
      },
    },
    concurrent: {  
      dev: ["build", "watch", "nodemon"],
      options: {
        logConcurrentOutput: true
      }
    },
    nodemon: {  
      dev: {
        script: 'index.js',
        options: {
          nodeArgs: [],
          watch: ['index.js', 'server/**.*.js'],
          delay: 300,
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });
          }
        }
      }
    },
    watch: {  
      less: {
        files: ["client/**/*.js", "client/index.html", "Gruntfile.js"],
        tasks: ['build'],
        options: { nospawn: true }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-purifycss');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-purifycss');
  grunt.loadNpmTasks("grunt-nodemon");  
  grunt.loadNpmTasks("grunt-concurrent");  
  grunt.loadNpmTasks("grunt-contrib-watch");


  // prepares files for deployment
  // grunt.registerTask('build', ['jshint', 'clean', 'concat', 'uglify', 'copy', 'cssmin', 'purifycss']);
  grunt.registerTask('build', ['jshint', 'clean', 'copy', 'cssmin', 'purifycss']);

  grunt.registerTask('default', ['concurrent']);

  grunt.registerTask('heroku', ['build']);

 
};
