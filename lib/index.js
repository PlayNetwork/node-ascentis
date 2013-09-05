var
	https = require('https'),


	DEFAULT_TIMEOUT = 3000,
	endpoint = 'https://selfservice2.ascentis.com/playnetwork/api/v1.1/',
	host = 'api.ascentis.com';

/*
https://selfservice2.ascentis.com/playnetwork/api/v1.1/
Client Key: M65ipU/X/Lk+zt1nHDVlV0
Secret Key: sPJ7s1L2VQkYmTS4ZmiSpY
*/

function callbackWrapper (ascentis, path, options, callback) {
	'use strict';

	var dataWrap = {
		apikey : ascentis.options.apikey,
		data : '',
		host : ascentis.options.host,
		options : options,
		path : path
	};

	return function (res) {
		res.on('data', function (chunk) {
			dataWrap.data += chunk;
		});

		res.on('end', function () {
			if (res.statusCode === 200) {
				callback(null, dataWrap);
			} else {
				var error = new Error(dataWrap.data);
				error.statusCode = res.statusCode;
				callback(error);
			}
		});
	};
}


function getParamsFromOptions (options) {
	'use strict';

	var
		key = '',
		params = '',
		val = '';

	if (typeof options === 'object') {
		for (key in options) {
			if (options.hasOwnProperty(key)) {
				val = options[key];
				params += '&' + key + '=' + encodeURIComponent(val);
			}
		}
	}

	return params;
}


function execRequest (ascentis, path, options, callback) {
	'use strict';

	var
		params = getParamsFromOptions(options),
		req = https.get({
			host : ascentis.options.host,
			path : path + params
		}, callbackWrapper(ascentis, path, options, callback))
			.on('error', function (e) {
				callback(e);
			})
			.on('socket', function (socket) {
				socket.setTimeout(options.timeout || DEFAULT_TIMEOUT);
				socket.on('timeout', function () {
					req.abort();
				});
			});

	return req;
}


exports.initialize = function (config) {
	'use strict';

	config = config || {};

	var
		ascentis = {
			options : {
				apikey : config.apikey || '',
				host : config.host || host
			}
		};

	function get(path, options, callback) {
		return execRequest(ascentis, path, options, callback);
	}

	ascentis.authenticate = function (options, callback) {
		return get('', options, callback);
	};

	return ascentis;
};