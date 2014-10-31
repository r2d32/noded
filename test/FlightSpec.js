var app = require('./helpers/app');

var should = require('should'),
	supertest = require('supertest');

describe('tasks', function () {
	
	it('should return valid task data for task 18', 
	function (done) {

		supertest(app)
		.get('/task/18')
		.expect(200)
		.end(function (err, res) {
			res.status.should.equal(200);
			done();
		});

	});

	it('should return an error for an invalid task', 
	function (done) {
		
		supertest(app)
		.get('/task/99999999')
		.expect(404)
		.end(function (err, res) {
			res.status.should.equal(404);
			done();
		});

	});

	it('should mark a task as acomplished',
	function (done) {
		supertest(app)
		.put('/task/18/acomplished')
		.expect(200)
		.end(function  (err, res) {
			res.status.should.equal(200);
			res.body.status.should.equal('done');

			supertest(app)
			.get('/task/18')
			.expect(200)
			.end(function (err, res) {
				res.status.should.equal(200);
				res.body.actualArrive
				.should.not.equal(undefined);

				done();
			})
		});
	});
});