var
	ascentis = requireWithCoverage('index');


describe('unit tests for component', function () {
	'use strict';

	this.timeout(25000);

	var client;

	beforeEach(function () {
		client = ascentis.initialize({
				account : 'testing',
				clientKey : 'key',
				host : 'api.ascentis.com',
				secretKey : 'secret'
			});

		client.request.get = function (options, callback) {
			return callback(null, options);
		};
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
				data.path.should.contain('/testing/api/v1.1/rawdata');
				data.headers.should.include.keys('Accept');
				data.headers.should.include.keys('Authorization');
				data.headers.should.include.keys('Timestamp');

				done();
			});
		});
	});

	describe('#getEmployees', function () {
		it('should properly retrieve employees', function (done) {
			client.getEmployees(function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.path.should.contain('/testing/api/v1.1/employees');
				data.headers.should.include.keys('Accept');
				data.headers.should.include.keys('Authorization');
				data.headers.should.include.keys('Timestamp');

				done();
			});
		});
	});

	describe('#getFields', function () {
		it('should properly retrieve custom defined fields', function (done) {
			client.getFields(function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.path.should.contain('/testing/api/v1.1/fields');
				data.headers.should.not.include.keys('Accept');
				data.headers.should.include.keys('Authorization');
				data.headers.should.include.keys('Timestamp');

				done();
			});
		});
	});

	describe('#getLocations', function () {
		it('should properly retrieve all locations', function (done) {
			client.getLocations(function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.path.should.contain('/testing/api/v1.1/location');
				data.headers.should.include.keys('Accept');
				data.headers.should.include.keys('Authorization');
				data.headers.should.include.keys('Timestamp');

				done();
			});
		});
	});

	describe('#getJobs', function () {
		it('should properly retrieve all jobs defined', function (done) {
			client.getJobs(function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.path.should.contain('/testing/api/v1.1/job');
				data.headers.should.include.keys('Accept');
				data.headers.should.include.keys('Authorization');
				data.headers.should.include.keys('Timestamp');

				done();
			});
		});
	});
});