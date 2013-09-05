var
	ascentis = requireWithCoverage('index'),

	account = 'playnetwork',
	clientKey = 'M65ipU/X/Lk+zt1nHDVlV0',
	host = 'https://selfservice2.ascentis.com',
	secretKey = 'sPJ7s1L2VQkYmTS4ZmiSpY';


describe('ascentis', function () {
	'use strict';

	var client;

	beforeEach(function () {
		client = ascentis.initialize({
				account : account,
				clientKey : clientKey,
				host : host,
				secretKey : secretKey
			});
	});

	describe('#getAuthHeader', function () {
		it('should properly build authentication header', function () {
			var signature = client.getAuthHeader('/api/v1.1/employees');
			should.exist(signature);
		});
	});

	describe('#getEmployees', function () {
		it('should properly retrieve employees', function (done) {
			client.getEmployees(function (err, employees) {
				should.not.exist(err);
				should.exist(employees);

				done();
			});
		});
	});
});