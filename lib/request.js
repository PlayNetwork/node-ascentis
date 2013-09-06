var
	events = require('events'),
	http = require('http'),
	https = require('https'),

	DEFAULT_TIMEOUT = 30000,
	EVENT_REQUEST = 'request';


/*
	A closure that enables basic configuration of the request
	that will be applied for every operation of the lib.
*/
exports.initialize = function (settings, self) {
	'use strict';

	self = self || Object.create(events.EventEmitter.prototype);
	self.settings = settings || {};

	// enable events on request
	events.EventEmitter.call(self);

	/*
		Actually executes a request given the supplied options,
		writing the specified data and returning the result to the
		supplied callback.

		In the event that an exception occurs on the request, the
		Error is captured and returned via the callback.
	*/
	function exec (options, data, callback) {
		if (!callback && typeof data === 'function') {
			callback = data;
			data = '';
		}

		options = self.getRequestOptions(options);
		data = data || '';
		if (typeof data !== 'string') {
			data = JSON.stringify(data);
		}

		if (!options.headers) {
			options.headers = {};
		}

		options.headers['Content-Length'] = Buffer.byteLength(data);

		if (self.emit) {
			self.emit(EVENT_REQUEST, options);
		}

		var req =
			(options.secure ? https : http).request(options, function (res) {
				var
					body = '',
					chunks = [],
					json = {},
					statusCode = res.statusCode;

				res.setEncoding('utf-8');

				res.on('data', function (chunk) {
					chunks.push(chunk);
				});

				res.once('end', function () {
					body = chunks.join('');

					if (statusCode >= 400) {
						var err = new Error(body);
						err.statusCode = statusCode;
						return callback(err);
					}

					if (!body && options.method === 'HEAD') {
						json = {
							statusCode : statusCode
						};
					} else {
						try {
							json = JSON.parse(body);
						} catch (err) {
							return callback(new Error(body, err));
						}
					}

					return callback(null, json);
				});
			});

		req.on('error', function (err) {
			return callback(err, null);
		});

		// timeout the connection
		if (options.timeout) {
			req.on('socket', function (socket) {
				socket.setTimeout(options.timeout);
				socket.on('timeout', function () {
					req.abort();
				});
			});
		}

		if (data) {
			req.write(data);
		}

		req.end();

		return req;
	}

	/*
		Effectively merges request options with preconfigured
		information. Priority is given to the input options...

		This could get wonky if a client thinks to encapsulate
		settings for the server within a server sub-document of
		the options document.

		i.e.

		// this will override base config.host
		options.host = '127.0.0.1'

		// this will result in config.server being set... host
		// will not effectively be overriden for the request
		options.server.host = '127.0.0.1'
	*/
	self.getRequestOptions = function (options) {
		var returnOptions = {};

		Object.keys(self.settings).forEach(function (field) {
			returnOptions[field] = self.settings[field];
		});
		Object.keys(options).forEach(function (field) {
			returnOptions[field] = options[field];
		});

		// ensure default timeout is applied if one is not supplied
		if (typeof returnOptions.timeout === 'undefined') {
			returnOptions.timeout = DEFAULT_TIMEOUT;
		}

		return returnOptions;
	};

	/*
		Issues a DELETE request to the server
	*/
	/*
	self.delete = function (options, callback) {
		options.method = 'DELETE';
		return exec(options, callback);
	};
	*/

	/*
		Issues a GET request to the server
	*/
	self.get = function (options, callback) {
		options.method = 'GET';
		return exec(options, callback);
	};

	/*
		Issues a HEAD request to the server
	*/
	/*
	self.head = function (options, callback) {
		options.method = 'HEAD';
		return exec(options, callback);
	};
	*/

	/*
		Issues a POST request with data (if supplied) to the server
	*/
	/*
	self.post = function (options, data, callback) {
		if (!callback && typeof data === 'function') {
			callback = data;
			data = null;
		}

		options.method = 'POST';
		return exec(options, data, callback);
	};
	*/

	/*
		Issues a PUT request with data (if supplied) to the server
	*/
	/*
	self.put = function (options, data, callback) {
		if (!callback && typeof data === 'function') {
			callback = data;
			data = null;
		}

		options.method = 'PUT';
		return exec(options, data, callback);
	};
	*/

	return self;
};
