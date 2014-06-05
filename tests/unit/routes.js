var request = require('supertest');
var expect = require('chai').expect;
var util = require('../lib/util.js');

describe('/api/sync Routes', function () {
  it('should return a 200 status code after trying to access the /api/sync route', function (done){
    util.authenticatedConnection({done: done}, function(err, result) {
      expect(err).not.to.exist;

      request.get({
        url: util.serverURL + '/api/sync/' + result.connectionID,
        jar: result.jar
      }, function(err, res, body) {
        expect(err).not.to.exist;
        expect(res.statusCode).to.equal(200);
        result.done();
      });
    });
  });
});

describe('/api/sync/:syncId/sources route', function () {
  it('should return a 403 if request.body is undefined', function (done){
    util.authenticatedConnection({done: done}, function(err, result) {
      expect(err).not.to.exist;

      request.get({
        url: util.serverURL + '/api/sync/' + result.connectionID + '/sources',
        jar: result.jar
      }, function(err, res, body) {
        expect(err).not.to.exist;
        expect(res.statusCode).to.equal(403);
        result.done();
      });
      
    });
  });
  it('should return a 201 when sync successfully retrieves path and srcList', function (done){
    util.authenticatedConnection({done: done}, function(err, result) {
      expect(err).not.to.exist;

      request.get({
        url: util.serverURL + '/api/sync/' + result.connectionID + '/sources',
        jar: result.jar
      }, function(err, res, body) {
        expect(err).not.to.exist;
        expect(res.json).to.deep.equal(201);
        result.done();
      });

    });
  });
});

describe('/api/sync/:syncId/checksums', function () {
  it('should return a 200 status code and the checksums after the sync validates', function (done){
    util.authenticatedConnection({done: done}, function(err, result) {
      expect(err).not.to.exist;

      request.get({
        url: util.serverURL + '/api/sync/' + result.connectionID + '/checksums',
        jar: result.jar
      }, function(err, res, body) {
        expect(err).not.to.exist;
        expect(res.json).to.deep.equal({ 200, { checksums: 'checksums' } });
        result.done();
      });
    });
  });
});

describe('/api/sync/:syncId/diffs', function () {
  it('should return a 200 status code if the req.body.diffs are valid', function (done){
    util.authenticatedConnection({done: done}, function(err, result) {
      expect(err).not.to.exist;

      request.get({
        url: util.serverURL + '/api/sync/' + result.connectionID + '/diffs',
        jar: result.jar
      }, function(err, res, body) {
        expect(err).not.to.exist;
        expect(res.json).to.deep.equal(200);
        result.done();
      });
    });
  });
});

describe('/healthcheck', function () {
  it('should return a 200 status code and the version if the healthcheck', function (done){
    util.authenticatedConnection({done: done}, function(err, result) {
      expect(err).not.to.exist;

      request.get({
        url: util.serverURL + '/healthcheck',
        jar: result.jar
      }, function(err, res, body) {
        expect(err).not.to.exist;
        expect(res.json).to.deep.equal({http: 'okay', version: 'version'});
        result.done();
      });
    });
  });
});
