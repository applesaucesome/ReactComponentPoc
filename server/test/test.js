var fs = require('fs');
var request = require('request');
var assert = require('assert');
var should = require('chai').should;
var expect = require('chai').expect;

var url = 'https://crowd.targetmarketingapps.com/api/ideas/55e9be01d477f218d01fb751';

var nock = require('nock');

//use nock to intercept the actual api call and return a mock object
var scope = nock('https://crowd.targetmarketingapps.com')
		.persist()
		.get('/api/ideas/55e9be01d477f218d01fb751')
		.reply(200, 'Hello from Crowd!');

describe('Ideas', function () {
	it('should find an idea by id', function (done) {
		request(url, function(error, response, body) {
			if(error){
				console.log("error: ", error);
			}
			expect(response.statusCode).to.equal(200);
			done();
		});
	})
});






