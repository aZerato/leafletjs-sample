module.exports = copy = {
	sample: {
		files: [
			// jquery
			{src: '<%= configs.bower %>/jquery/dist/jquery.js', dest: '<%= configs.vendors %>/jquery/jquery.js' },

			// pubsub
			{src: '<%= configs.bower %>/pubsub-js/src/pubsub.js', dest: '<%= configs.vendors %>/pubsub/pubsub.js' },

			// leaflet
			{src: '<%= configs.bower %>/leaflet/dist/leaflet.js', dest: '<%= configs.vendors %>/leaflet/leaflet.js' },
			{src: '<%= configs.bower %>/leaflet/dist/leaflet.css', dest: '<%= configs.vendors %>/leaflet/leaflet.css' },
			{expand: true, cwd: '<%= configs.bower %>/leaflet/dist/images/', src: '*', dest: '<%= configs.vendors %>/leaflet/images/'},
		
			// App
			{src: '<%= configs.src %>/assets/index.html', dest: '<%= configs.web %>/index.html' },
			{src: '<%= configs.src %>/assets/sample.gpx', dest: '<%= configs.web %>/sample.gpx' },
			{src: '<%= configs.src %>/assets/app.css', dest: '<%= configs.web %>/styles/app.css' },
			{expand: true, cwd: '<%= configs.src %>/scripts/', src: '*', dest: '<%= configs.scripts %>'}
		]
	}
}