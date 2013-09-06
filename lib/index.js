var
	crypto = require('crypto'),
	moment = require('moment'),

	request = require('./request');


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

		options.headers = self.getRequestHeaders(options);

		return options;
	}

	// #TODO: Need to parameterize changesince value
	self.getBulkData = function (callback) {
		var options = getOptions('/api/v1.1/rawdata?include=employee,job&changesince=1/1/2013');

		return self.request.get(options, callback);
	};

	self.getEmployees = function (callback) {
		var options = getOptions('/api/v1.1/employees');

		return self.request.get(options, callback);
	};

	self.getRequestHeaders = function (options) {
		if (options.path.charAt(0) !== '/') {
			options.path = '/' + options.path;
		}

		var
			timestamp = moment.utc().format('YYYY-MM-DDThh:mm:ss') + 'Z',
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
			Accept : 'text/json',
			Timestamp : timestamp,
			Authorization : encodeURIComponent(self.config.clientKey) + ':' + encodeURIComponent(signature)
		};
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
