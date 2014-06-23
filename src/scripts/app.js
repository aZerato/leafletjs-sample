var Controller = (function() {

	var Controller = function(element) {
		this.$el = element;
		
		this.ready = false;

		this.position = []; // current position
		
		this.map = null; //leaflet map
		
		this.countries = [
			{
				id: 1,
				name: 'Paris',
				position: [48.85562, 2.34833],
				active: false
			},
			{
				id: 2,
				name: 'London',
				position: [51.50264, -0.1181],
				active: false
			},
			{
				id: 3,
				name: 'Washington',
				position: [38.89837, -77.03751],
				active: false
			},
			{
				id: 4,
				name: 'Montreal',
				position: [45.51666, -73.59329],
				active: false
			}
		];

		this.layer = [
			{
				name: 'OpenStreetMap',
				idLayer: 'examples.map-i86knfo3',
				url: 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
			},
			{
				name: 'GoogleMap'
			}
		];

		this.baseMaps = null;
		this.overlayMaps = [];
		this.overlayMapsGroups = {
			"Cities" : null
		};
		this.ctrl = null;
	};

	Controller.prototype.init = function() {
		this.geolocation();
	};

	Controller.prototype.geolocation = function() {
		var self = this;

		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				self.position = [position.coords.latitude, position.coords.longitude];
				self.ready = true;
				// signal that localization is ready (Event with pubsub)
				PubSub.publish('localizationReady');
			});
		} else {
			alert('You\'re browser doesn\'t support html5 geolocation');
		}
	};

	Controller.prototype.layerLeaflet = function() {
		var self = this;

		//Mapbox
		var osmLayer = new L.tileLayer(self.layer[0].url, {
			maxZoom: 18,
			attribution: self.layer[0].attribution,
			id: self.layer[0].idLayer
		});

		// Google
		var googleLayer = new L.Google('ROADMAP');

		self.baseMaps = {
			"OpenStreetMap": osmLayer,
			"Google": googleLayer
		};

		// setView([lat,long], zoom)
		self.map = new L.map('leaflet-map', {
			center: self.position,
			zoom: 10,
			layers: [osmLayer]//default layer
		});

		self.defaultEvents();

		self.createMarker(self.position, 'You\'re here !');
	};

	/* Map */
	Controller.prototype.defaultEvents = function() {
		var self = this;

		// Add control button for switch between d
		self.ctrl = new L.control.layers(self.baseMaps).addTo(self.map);


		self.map.on('click', function(e) {
			self.createPopup(e.latlng, 'Click ' + e.latlng);	
		});
	};

	Controller.prototype.createMarker = function(position, message)
	{
		var self = this,
			exist = false;

		// check if marker doesn't already exist
		if(self.overlayMaps.length > 0)
		{
			for (var i = 0; i < self.overlayMaps.length; i++) {
				if(self.overlayMaps[i]._latlng.equals(position)) {
					exist = true;
				}
			};

			if(exist === false)
			{
				self.addMarker(position, message);
			}
		}
		else
		{
			self.addMarker(position, message);
		}
	};

	Controller.prototype.addMarker = function(position, message)
	{
		var self = this;

		var marker = new L.marker(position).bindPopup(message).openPopup().addTo(self.map);

		self.overlayMaps.push(marker)
		
		self.map.removeLayer(self.baseMaps);

		// Remove older control
		self.map.removeControl(self.ctrl);

		self.overlayMapsGroups.Cities = new L.layerGroup(self.overlayMaps);

		// Remove property added by leaflet
		delete self.baseMaps._leaflet_id
		self.ctrl = new L.control.layers(self.baseMaps, self.overlayMapsGroups).addTo(self.map);
	};

	Controller.prototype.createPopup = function(position, message)
	{
		var self = this;

		L.popup().setLatLng(position).setContent(message).openOn(self.map);
	};

	Controller.prototype.moveCountry = function(idCountry) 
	{
		var self = this;

		if(idCountry == 0)
		{
			self.map.setView(self.position, 10);
		}
		else
		{
			for (var i = 0; i < self.countries.length; i++) {
				if (self.countries[i].id == idCountry && self.countries[i].active == false)
				{
					self.map.setView(self.countries[i].position, 10);
					self.createMarker(self.countries[i].position, self.countries[i].name);

					self.countries[i].active = true;

					var positions = [self.position, self.countries[i].position];

					// create line between your position & selected country
					self.tracePolyline(positions);
				}
			};
		}
	};

	Controller.prototype.tracePolyline = function(positions)
	{
		var self = this;

		L.polyline(positions, {color: 'red'}).addTo(self.map);
	};

	Controller.prototype.createRandomMarker = function() {
		var self = this;

		self.createMarker([self.position[0] - 0.05, self.position[1] + 0.05 ], 'Random Marker Near your position')
	};

	Controller.prototype.readGpx = function() {
		var self = this;

		$.ajax('sample.gpx', { type: 'get', cache: false, dataType: 'xml' })
			.success(function(xml) {
				self.parseGpx(xml);
			});
	};

	Controller.prototype.parseGpx = function(xml)
	{
		var self = this,
			track = [],
			waypoints = $(xml).find('wpt');

		for (var i = 0; i < waypoints.length; i++) {
			track.push([parseFloat(waypoints[i].getAttribute('lat')), parseFloat(waypoints[i].getAttribute('lon'))]);
		};
		
		self.tracePolyline(track);

		//
		self.addMarker(track[0], "Track begin !");
		self.addMarker(track[track.length - 1], "Track ending !");
		//
		self.map.setView(track[0], 13);
	};

	return Controller;
})();