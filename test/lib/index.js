var
	ascentis = requireWithCoverage('index'),

	account = 'playnetwork',
	clientKey = 'M65ipU/X/Lk+zt1nHDVlV0',
	host = 'selfservice2.ascentis.com',
	secretKey = 'sPJ7s1L2VQkYmTS4ZmiSpY';


describe('ascentis', function () {
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

	describe('#createRequestHeaders', function () {
		it('should properly build authentication and timestamp header values', function () {
			var headers = client.createRequestHeaders({ path : '/api/v1.1/employees' });
			should.exist(headers);
			should.exist(headers.Timestamp);
			should.exist(headers.Authorization);
		});
	});

	describe('#getBulkData', function () {
		it('should properly retrieve bulk employee data', function (done) {
			client.getBulkData(function (err, data) {
				should.not.exist(err);
				should.exist(data);

				done();
			});
		});
	});

	describe('#getEmployees', function () {
		it('should properly retrieve employees', function (done) {
			client.getEmployees(function (err, data) {
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

	describe('#getJobs', function () {
		it('should properly retrieve all jobs defined', function (done) {
			client.getJobs(function (err, data) {
				should.not.exist(err);
				should.exist(data);

				done();
			});
		});
	});
});