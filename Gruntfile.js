module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		jade: {
			prepare: {
				options: {
					pretty: true,
				},
				files: {
					'index.html': 'jade/index.jade',
				},
			}
		},

		inline: {
			dist: {
				options: {
					tag: '',
					cssmin: true,
					uglify: true,
				},
				src: ['index.html'],
			}
		},

		cssUrlEmbed: {
			encode: {
				expand: true,
				src: ['index.html'],
			}
		},

		// inlinecss: {
		// 	main: {
		// 		options: {
		// 		},
		// 		src: ['index.html'],
		// 	}
		// },

		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				commitFiles: ['package.json', 'bower.json'],
				pushTo: 'origin'
			}
		},

		copy: {
			prepare: {
				files: [{
					src: [
						'**',
						'!node_modules/**',
						'!bower_components/**',
						'!Contributing.md',
						'!Gruntfile.js',
						'!License.md',
						'!Readme.md',
						'!bower.json',
						'!package.json'
					],
					dest: 'temp/pres/'
				},{
					expand: true,
					cwd: 'node_modules/shower-core/',
					src: [
						'**',
						'!package.json',
						'!Readme.md'
					],
					dest: 'temp/pres/shower/'
				},{
					expand: true,
					cwd: 'node_modules/shower-ribbon/',
					src: [
						'**',
						'!package.json',
						'!Readme.md'
					],
					dest: 'temp/pres/shower/themes/ribbon/'
				},{
					expand: true,
					cwd: 'node_modules/shower-bright/',
					src: [
						'**',
						'!package.json',
						'!Readme.md'
					],
					dest: 'temp/pres/shower/themes/bright/'
				}]
			}
		},

		replace: {
			core: {
				src: 'temp/pres/index.html',
				overwrite: true,
				replacements: [{
					from: /(node_modules|bower_components)\/shower-core/g,
					to: 'shower'
				},{
					from: /(node_modules|bower_components)\/shower-(ribbon|bright)/g,
					to: 'shower/themes/$2'
				}]
			},
			themes: {
				src: 'temp/pres/shower/themes/*/index.html',
				overwrite: true,
				replacements: [{
					from: '../shower-core', to: '../..'
				}]
			}
		},

		'gh-pages': {
			options: {
				base: 'temp/pres',
				clone: 'temp/clone'
			},
			src: ['**']
		},

		compress: {
			shower: {
				options: {
					archive: 'archive.zip'
				},
				files: [{
					expand: true,
					cwd: 'temp/pres/',
					src: '**',
					dest: '.'
				}]
			}
		},

		clean: ['temp'],

		watch: {
			jade: {
				files: 'jade/**/*.jade',
				tasks: ['jade:prepare'],
				options: {
					spawn: false,
				},
			},
		},
	});

	grunt.registerTask('single', [
		'jade',
		'inline',
		'cssUrlEmbed',
	]);

	grunt.registerTask('publish', [
		'jade',
		'copy',
		'replace',
		'gh-pages',
		'clean'
	]);

	grunt.registerTask('archive', [
		'jade',
		'copy',
		'replace',
		'compress',
		'clean'
	]);

};
