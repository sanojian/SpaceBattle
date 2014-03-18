var path = require('path');

module.exports = function(grunt) {

	// Load Grunt tasks declared in the package.json file
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration.
	grunt.initConfig({

		develop: {
			server: {
				file: 'server.js'
				//nodeArgs: ['--debug'],            // optional
				//args: ['appArg1', 'appArg2']      // optional
			}
		},
		express: {
			options: {
				hostname: "0.0.0.0",
				port:5000
			},
			livereload: {
				options: {
					//script:'app.js',
					server: path.resolve('./server.js'),
					bases: [path.resolve('./public')],
					livereload: true
					//serverreload: true

				}
			}
		},
		watch: {
			less: {
				files: [
					'less/*.less'
				],
				tasks: ['less']
			},
			scripts: {
				files: [
					'js/*.js',
					'dialog/*.js'
				],
				tasks: ['concat']
			}
		},
		concat: {
			basic_and_extras: {
				files: {
					'public/js/game.js': ['js/*.js']
				}
			}
		},
		less: {
			development: {
				options: {
					paths: ["./less"]
					//yuicompress: true
				},
				files: {
					"./public/css/style.css": "./less/style.less"
				}
			}
		},

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('server', [
		'express:livereload',
		'watch'
	]);
	grunt.registerTask('build', ['less','concat']);
	grunt.registerTask('default', ['build','server']);

};