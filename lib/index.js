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

	function getQuerystring(criteria) {
		var query = '';

		Object.keys(criteria).forEach(function (key) {
			query = key + '=' + criteria[key] + '&';
		});

		return query;
	}

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

	// creates request headers used for each API call
	// includes Security, Timestamp and Accept values
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

	self.getChanges = function (criteria, callback) {
		if (!callback && typeof criteria === 'function') {
			callback = criteria;
			criteria = {};
		}

		if (!criteria.from && !criteria.id) {
			return callback(new Error('id or from is required'));
		}

		var path = '/api/v1.1/changes';

		if (criteria.id) {
			path = path + '/' + criteria.id;
			delete criteria.id;
		}

		var
			query = getQuerystring(criteria),
			options = getOptions(path + (query ? ('?' + query) : ''));

		return self.request.get(options, callback);
	};

	self.getCOBRAEligibleEmployees = function (criteria, callback) {
		if (!callback && typeof criteria === 'function') {
			callback = criteria;
			criteria = {};
		}

		if (!criteria.from) {
			return callback(new Error('from is required'));
		}

		var
			query = getQuerystring(criteria),
			options = getOptions('/api/v1.1/cobra' + (query ? ('?' + query) : ''));

		return self.request.get(options, callback);
	};

	self.getDirectDeposits = function (criteria, callback) {
		if (!callback && typeof criteria === 'function') {
			callback = criteria;
			criteria = {};
		}

		if (!criteria.employeeId) {
			return callback(new Error('employeeId is required'));
		}

		var options = getOptions('/api/v1.1/employee/' + criteria.employeeId + '/deposit');
		return self.request.get(options, callback);
	};

	self.getEmergencyContacts = function (criteria, callback) {
		if (!callback && typeof criteria === 'function') {
			callback = criteria;
			criteria = {};
		}

		if (!criteria.employeeId) {
			return callback(new Error('employeeId is required'));
		}

		var options = getOptions('/api/v1.1/employee/' + criteria.employeeId + '/emergency');
		return self.request.get(options, callback);
	};

	self.getEmployeeBenefits = function (criteria, callback) {
		if (!callback && typeof criteria === 'function') {
			callback = criteria;
			criteria = {};
		}

		if (!criteria.employeeId) {
			return callback(new Error('employeeId is required'));
		}

		var path = '/api/v1.1/employee/' + criteria.employeeId + '/benefits';
		delete criteria.employeeId;

		var
			query = getQuerystring(criteria),
			options = getOptions(path + (query ? ('?' + query) : ''));

		return self.request.get(options, callback);
	};

	self.getEmployeeJobDetails = function (criteria, callback) {
		if (!callback && typeof criteria === 'function') {
			callback = criteria;
			criteria = {};
		}

		if (!criteria.employeeId) {
			return callback(new Error('employeeId is required'));
		}

		var path = '/api/v1.1/employee/' + criteria.employeeId + '/job';
		delete criteria.employeeId;

		var
			query = getQuerystring(criteria),
			options = getOptions(path + (query ? ('?' + query) : ''));

		return self.request.get(options, callback);
	};

	self.getEmployees = function (criteria, callback) {
		if (!callback && typeof criteria === 'function') {
			callback = criteria;
			criteria = {};
		}

		var
			query = getQuerystring(criteria),
			options = getOptions('/api/v1.1/employees' + (query ? ('?' + query) : ''));

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

	self.getLocations = function (criteria, callback) {
		if (!callback && typeof criteria === 'function') {
			callback = criteria;
			criteria = {};
		}

		var options = getOptions('/api/v1.1/location' + (criteria.locationId ? ('/' + criteria.locationId) : ''));
		return self.request.get(options, callback);
	};

	self.getJobs = function (criteria, callback) {
		if (!callback && typeof criteria === 'function') {
			callback = criteria;
			criteria = {};
		}

		var options = getOptions('/api/v1.1/job' + (criteria.jobId ? ('/' + criteria.jobId) : ''));
		return self.request.get(options, callback);
	};

	// #TODO: Need to parameterize changesince and include values
	self.getRawData = function (callback) {
		var options = getOptions('/api/v1.1/rawdata?include=employee,job&changesince=1/1/2013');
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
