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

	describe('#getChanges', function () {
		it('should report an exception if no from or id parameter is supplied', function (done) {
			client.getChanges(function (err, data) {
				should.exist(err);
				should.not.exist(data);

				done();
			});
		});

		it('should properly retrieve changes with from parameter', function (done) {
			client.getChanges({ from : '1/1/2013' }, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.path.should.contain('/testing/api/v1.1/changes?from=1/1/2013');
				data.headers.should.include.keys('Accept');
				data.headers.should.include.keys('Authorization');
				data.headers.should.include.keys('Timestamp');

				done();
			});
		});

		it('should properly retrieve changes with id parameter', function (done) {
			client.getChanges({ id : 1 }, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.path.should.contain('/testing/api/v1.1/changes/1');
				data.headers.should.include.keys('Accept');
				data.headers.should.include.keys('Authorization');
				data.headers.should.include.keys('Timestamp');

				done();
			});
		});
	});

	describe('#getCOBRAEligibleEmployees', function () {
		it('should report an exception if no from parameter is supplied', function (done) {
			client.getCOBRAEligibleEmployees(function (err, data) {
				should.exist(err);
				should.not.exist(data);

				done();
			});
		});

		it('should properly retrieve COBRA eligible employees', function (done) {
			client.getCOBRAEligibleEmployees({ from : '1/1/2013' }, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.path.should.contain('/testing/api/v1.1/cobra?from=1/1/2013');
				data.headers.should.include.keys('Accept');
				data.headers.should.include.keys('Authorization');
				data.headers.should.include.keys('Timestamp');

				done();
			});
		});
	});

	describe('#getDirectDeposits', function () {
		it('should report an exception if no employeeId is supplied', function (done) {
			client.getDirectDeposits(function (err, data) {
				should.exist(err);
				should.not.exist(data);

				done();
			});
		});

		it('should properly retrieve employee direct deposits', function (done) {
			client.getDirectDeposits(1, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.path.should.contain('/testing/api/v1.1/employee/1/deposit');
				data.headers.should.include.keys('Accept');
				data.headers.should.include.keys('Authorization');
				data.headers.should.include.keys('Timestamp');

				done();
			});
		});
	});

	describe('#getEmergencyContacts', function () {
		it('should report an exception if no employeeId is supplied', function (done) {
			client.getEmergencyContacts(function (err, data) {
				should.exist(err);
				should.not.exist(data);

				done();
			});
		});

		it('should properly retrieve employee emergency contacts', function (done) {
			client.getEmergencyContacts(1, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.path.should.contain('/testing/api/v1.1/employee/1/emergency');
				data.headers.should.include.keys('Accept');
				data.headers.should.include.keys('Authorization');
				data.headers.should.include.keys('Timestamp');

				done();
			});
		});
	});


	describe('#getEmployeeJobDetails', function () {
		it('should throw error if employeeId is not present', function (done) {
			client.getEmployeeJobDetails(function (err, data) {
				should.exist(err);
				should.not.exist(data);

				done();
			});
		});

		it ('should properly retrieve job details', function (done) {
			var criteria = {
				employeeId : 1
			};

			client.getEmployeeJobDetails(criteria, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.path.should.contain('/testing/api/v1.1/employee/1');
				data.headers.should.include.keys('Accept');
				data.headers.should.include.keys('Authorization');
				data.headers.should.include.keys('Timestamp');

				done();
			});
		});

		it ('should properly retrieve job details with asof parameter', function (done) {
			var criteria = {
				employeeId : 1,
				asof : '2013-01-01'
			};

			client.getEmployeeJobDetails(criteria, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.path.should.contain('/testing/api/v1.1/employee/1/job?asof=2013-01-01');
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

		it('should properly search employees', function (done) {
			client.getEmployees({ lastname : 'bawss' }, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.path.should.contain('/testing/api/v1.1/employees?lastname=bawss');
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

		it('should properly retrieve a specific location', function (done) {
			client.getLocations(1, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.path.should.contain('/testing/api/v1.1/location/1');
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

	describe('#getRawData', function () {
		it('should properly retrieve raw employee data', function (done) {
			client.getRawData(function (err, data) {
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
});
