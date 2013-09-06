var
	crypto = require('crypto'),
	moment = require('moment'),
	xml2js = require('xml2js'),

	parseOptions = {
		mergeAttrs : true,
		normalize : true,
		normalizeTags : true,
		trim : true
	},
	request = require('./request'),
	xmlParser = new xml2js.Parser(parseOptions);

module.exports = (function (self) {
	'use strict';

	self = self || {};
	self.config = {};

	function getOptions(path) {
		if (path.charAt(0) !== '/') {
			path = '/' + path;
		}

		var options = {
			host : self.config.host,
			path : '/' + self.config.account + path,
			secure : true
		};

		options.headers = self.createRequestHeaders(options);

		return options;
	}

	self.createRequestHeaders = function (options) {
		if (options.path.charAt(0) !== '/') {
			options.path = '/' + options.path;
		}

		var
			timestamp = moment
				.utc()
				.add('hours', 12) // #TODO: Figure out proper timezone: this hack ensures non-expired timestamp responses from API
				.format('YYYY-MM-DDThh:mm:ss') + 'Z',
			hash = (options && options.method ? options.method.toUpperCase() : 'GET') +
				' ' +
				options.path.toLowerCase() +
				' ' +
				timestamp,
			signature = crypto
				.createHmac('sha1', new Buffer(self.config.secretKey, 'ascii'))
				.update(new Buffer(hash, 'ascii'))
				.digest('base64');

		return {
			Accept : 'application/json',
			Timestamp : timestamp,
			Authorization : encodeURIComponent(self.config.clientKey) + ':' + encodeURIComponent(signature)
		};
	};

	// #TODO: Need to parameterize changesince and include values
	self.getBulkData = function (callback) {
		var options = getOptions('/api/v1.1/rawdata?include=employee,job&changesince=1/1/2013');

		return self.request.get(options, callback);
	};

	// #TODO: Need to add support for search parameters for request
	self.getEmployees = function (callback) {
		var options = getOptions('/api/v1.1/employees');

		return self.request.get(options, callback);
	};

	self.getFields = function (callback) {
		var options = getOptions('/api/v1.1/fields');

		// this API is inconsistent... some methods won't allow return in JSON format
		// however the documentation indicates that it should
		delete options.headers.Accept;

		// hack callback wrapper to catch error and convert XML to JSON
		return self.request.get(options, function (err, data) {
			if (data) {
				return callback(err, data);
			}

			if (err.data) {
				return xmlParser.parseString(err.data, callback);
			}

			return callback(err);
		});
	};

	// #TODO: Add support for retrieval of a specific location by ID
	self.getLocations = function (callback) {
		var options = getOptions('/api/v1.1/location'); // OMFG... there isn't even consistent resource pluralization

		return self.request.get(options, callback);
	};

	// #TODO: Add support for retrieval of a specific job by ID
	self.getJobs = function (callback) {
		var options = getOptions('/api/v1.1/job'); // OMFG... there isn't even consistent resource pluralization

		return self.request.get(options, callback);
	};

	return {
		initialize : function (config) {
			// default config settings
			config = config || {};
			config.account = config.account || 'selfservice';
			config.clientKey = config.clientKey || '';
			config.host = config.host || '';
			config.secretKey = config.secretKey || '';

			// configure proxy and return
			self.config = config;
			self.request = request.initialize();
			return self;
		}
	};
})({});
