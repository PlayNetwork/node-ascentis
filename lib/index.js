var
	crypto = require('crypto'),
	moment = require('moment'),

	request = require('./request');


module.exports = (function (self) {
	'use strict';

	self = self || {};
	self.config = {};

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
			Timestamp : timestamp,
			signature : signature,
			Authorization : encodeURIComponent(self.config.clientKey) + ':' + encodeURIComponent(signature)
		};
	};

	self.getEmployees = function (callback) {
		var options = {
			host : self.config.host,
			method : 'GET',
			path : '/' + self.config.account + '/api/v1.1/employees',
			secure : true
		};

		options.headers = self.getRequestHeaders(options);

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
