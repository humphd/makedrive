var request = require('request');
var expect = require('chai').expect;
var util = require('../lib/util.js');

describe('/api/sync route', function () {
  it('should return a 200 status code after trying to access the /api/sync route', function (done){
    util.authenticatedConnection({done: done}, function(err, result) {
      expect(err).not.to.exist;

      request.get({
        url: util.serverURL + '/api/sync/' + result.syncId,
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
  it('should return a 401 if route invocation call is out of order', function (done){
    util.authenticatedConnection({done: done}, function(err, result) {
      expect(err).not.to.exist;
//    TO BE REPLACED WITH UTIL FUNCTION FOR ROUTE INVOCATION
//      request.post({
//        url: util.serverURL + '/api/sync/' + result.syncId + '/sources',
//        jar: result.jar
//      },
        //something like this?
        util.sourceRouteConnect(function(err, res, body) {
          expect(err).not.to.exist;
          expect(res.statusCode).to.equal(401);
          result.done();
      });
      
    });
  });
  it('should return a 201 when sync successfully retrieves path and srcList', function (done){
    util.authenticatedConnection({done: done}, function(err, result) {
      expect(err).not.to.exist;
//    TO BE REPLACED WITH UTIL FUNCTION FOR ROUTE INVOCATION
//      request.post({
//        url: util.serverURL + '/api/sync/' + result.syncId + '/sources',
//        jar: result.jar
//      }, function(err, res, body) {
        expect(err).not.to.exist;
        expect(res.statusCode).to.equal(201);
        result.done();
      });

    });
  });
});

//describe('/api/sync/:syncId/checksums', function () {
//  it('should return a 200 status code and the checksums after the sync validates', function (done){
//    util.authenticatedConnection({done: done}, function(err, result) {
//      expect(err).not.to.exist;
//
//      request.get({
//        url: util.serverURL + '/api/sync/' + result.syncId + '/checksums',
//        jar: result.jar
//      }, function(err, res, body) {
//        expect(err).not.to.exist;
//        expect(body.checksums).to.exist;
//        expect(res.statusCode).to.equal(200);
//        result.done();
//      });
//    });
//  });
//});
//
//describe('/api/sync/:syncId/diffs', function () {
//  it('should return a 200 status code if the req.body.diffs are valid', function (done){
//    util.authenticatedConnection({done: done}, function(err, result) {
//      expect(err).not.to.exist;
//
//      request.get({
//        url: util.serverURL + '/api/sync/' + result.syncId + '/diffs',
//        jar: result.jar
//      }, function(err, res, body) {
//        expect(err).not.to.exist;
//        expect(res.statusCode).to.equal(200);
//        result.done();
//      });
//    });
//  });
//});
//
//describe('/healthcheck', function () {
//  it('should return a 200 status code and the version if the healthcheck', function (done){
//    util.authenticatedConnection({done: done}, function(err, result) {
//      expect(err).not.to.exist;
//
//      request.get({
//        url: util.serverURL + '/healthcheck',
//        jar: result.jar
//      }, function(err, res, body) {
//        expect(err).not.to.exist;
//        expect(body.http).to.be('okay');
//        expect(body.version).to.exist;
//        result.done();
//      });
//    });
//  });
//});
