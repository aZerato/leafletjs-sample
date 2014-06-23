module.exports = function(grunt) {
	
	/**
	* tasks configurations.
	*/
	var configs = require('./grunt_tasks/configs');
	var copy = require('./grunt_tasks/copy');
	var clean = require('./grunt_tasks/clean');
	var watch = require('./grunt_tasks/watch');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		configs: configs,
		copy: copy,
		clean: clean,
		watch: watch
	});

	/**
	* load tasks.
	*/
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	//
	grunt.registerTask('build', [
		'clean:sample',
		'copy:sample'
	]);

	grunt.registerTask('watchbuild', [
		'watch:sample'
	]);
};