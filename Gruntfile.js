'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
				files: {
					'dist/app/css/output.css': ['bower_components/ng-table/dist/ng-table.min.css',
                                      'app/styles/main.css',
                                      'app/styles/cardimg.css']
				}
			}
		},
		uglify: {
			my_target: {
 		  	files: {
					'dist/app/js/deps.min.js': ['bower_components/jquery/dist/jquery.min.js',
												'bower_components/bootstrap/dist/js/bootstrap.min.js',
												'bower_components/angular/angular.min.js',
												'bower_components/angular-route/angular-route.min.js',
												'bower_components/moment/min/moment.min.js',
												'bower_components/numeral/min/numeral.min.js',
												'bower_components/highcharts/highstock.js',
												'bower_components/highcharts/highcharts-more.js',
												'bower_components/highcharts/modules/exporting.js',
                        'bower_components/jquery-ui/jquery-ui.min.js',
                        'bower_components/angular-cookies/angular-cookies.min.js',
                        'bower_components/ng-table/dist/ng-table.min.js'],
 		    	'dist/app/js/app.min.js': ['app/app.js', 'app/flags.js', 'app/globalHighchartOptions.js', 'app/scripts/**/*.js']

				}
			}
		},
		copy: {
			main: {
				files: [
					{expand: true, cwd: 'app/views', src: '*', dest: 'dist/app/views'},
					{expand: true, cwd: 'app/images', src: '*', dest: 'dist/app/images'},
					{expand: true, cwd: 'bower_components/bootstrap/dist', src: '**', dest: 'dist/app/css/bootstrap'},
          {expand: true, cwd: 'bower_components/jquery-ui', src: '**', dest: 'dist/app/css/jquery-ui'}
				]
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('do', [
		'cssmin',
		'uglify',
		'copy'
	]);

};
