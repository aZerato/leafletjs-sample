module.exports = watch = {
	sample: {
		files: '<%= configs.src %>/**',
		tasks: ['build'],
		options: {
			livereload: true
		}
	}
};