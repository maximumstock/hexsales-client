'use strict';

var shim = require('browserify-shim');

module.exports = function(grunt) {
	grunt.initConfig({
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
				files: {
					'dist/css/output.css': ['app/styles/main.css', 'app/styles/cardimg.css']
				}
			}
		},
		uglify: {
			files: {
				'dist/js/app.min.js': ['app/app.js']
			}
		},
		browserify2: {
			compile: {
				entry: './app/app.js',
				compile: './dist/js/app.min.js',
				beforeHook: function(bundle) {
					shim(bundle, {
						jquery: {
							path: './bower_components/jquery/dist/jquery.min.js',
							exports: '$'
						}
					});
				}
			}
		}
	 });


	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-browserify2');
	
	grunt.registerTask('do', [
		'cssmin',
	//	'browserify2:compile',
		'uglify'
	]);

};
