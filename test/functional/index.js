var
	ascentis = requireWithCoverage('index'),

	account = '', // your company/account name here
	clientKey = '', // your client key from ascentis
	host = 'selfservice2.ascentis.com', // the corrent ascentis API URL
	secretKey = ''; // your secret key from ascentis

describe('functional tests for Ascentis API', function () {
	'use strict';

	this.timeout(25000);

	var client;

	beforeEach(function () {
		client = ascentis.initialize({
				account : account,
				clientKey : clientKey,
				host : host,
				secretKey : secretKey
			});

		/*
		client.request.on('request', function (options) {
			console.log(options);
		});
		//*/
	});

	describe('#getEmployees', function () {
		it('should properly retrieve employees', function (done) {
			client.getEmployees(function (err, data) {
				should.not.exist(err);
				should.exist(data);

				done();
			});
		});

		it('should properly search employees', function (done) {
			client.getEmployees({ lastname : 'thomas' }, function (err, data) {
				should.not.exist(err);
				should.exist(data);

				done();
			});
		});
	});

	describe('#getEmergencyContacts', function () {
		it('should properly retrieve employee emergency contacts', function (done) {
			client.getEmergencyContacts(362, function (err, data) {
				should.not.exist(err);
				should.exist(data);

				done();
			});
		});
	});

	describe('#getFields', function () {
		it('should properly retrieve custom defined fields', function (done) {
			client.getFields(function (err, data) {
				should.not.exist(err);
				should.exist(data);

				done();
			});
		});
	});

	describe('#getLocations', function () {
		it('should properly retrieve all locations', function (done) {
			client.getLocations(function (err, data) {
				should.not.exist(err);
				should.exist(data);

				done();
			});
		});

		it('should properly retrieve a specific location', function (done) {
			client.getLocations(151, function (err, data) {
				should.not.exist(err);
				should.exist(data);

				done();
			});
		});
	});

	describe('#getJobs', function () {
		it('should properly retrieve all jobs defined', function (done) {
			client.getJobs(function (err, data) {
				should.not.exist(err);
				should.exist(data);

				done();
			});
		});

		it('should properly retrieve a specific job', function (done) {
			client.getJobs(337, function (err, data) {
				should.not.exist(err);
				should.exist(data);

				done();
			});
		});
	});

	describe('#getRawData', function () {
		it('should properly retrieve bulk employee data', function (done) {
			client.getRawData(function (err, data) {
				should.not.exist(err);
				should.exist(data);

				done();
			});
		});
	});
});
