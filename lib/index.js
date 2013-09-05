var
	crypto = require('crypto'),

	request = require('./request');


module.exports = (function (self) {
	'use strict';

	self = self || {};
	self.config = {};

	self.getAuthHeader = function (path, options) {
		if (path.charAt(0) !== '/') {
			path = '/' + path;
		}

		var
			date = new Date(),
			hash = options && options.method ? options.method.toUpperCase() : 'GET' +
				' ' +
				path.toLowerCase() +
				' ' +
				date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate() +
				'T' +
				date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds() +
				'Z',
			signature = crypto.createHmac('sha1', self.config.secretKey).update(hash).digest('hex');

		return signature;
	};

	self.getEmployees = function (callback) {
		var
			options = { method : 'GET' },
			path = '/' + self.config.account + '/api/v1.1/employees',
			authorization = self.getAuthHeader(path, options);

		return self.request.get({
				host : self.config.host,
				path : path,
				secure : true
			}, callback);
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