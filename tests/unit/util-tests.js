var expect = require('chai').expect;
var util = require('../lib/util.js');
var request = require('request');

describe('Test util.js', function () {

  it('util.app should return the Express app instance', function () {
    expect(util.app).to.exist;
  });
/*
  it('util.connection should return connectionID and close method on callback', function (done) {
    util.connection(function(err, result) {
      expect(err).not.to.exist;
      expect(result.connectionID).to.match(/\w{8}(-\w{4}){3}-\w{12}?/);
      expect(result.close).to.be.a.function;
      result.close();
      done();
    });
  });

  it('util.connection should return different connectionIDs on subsequent calls', function(done) {
    util.connection(function(err, result) {
      expect(err).not.to.exist;
      expect(result.connectionID).to.match(/\w{8}(-\w{4}){3}-\w{12}?/);
      expect(result.close).to.be.a.function;

      var close1 = result.close;
      var connectionID1 = result.connectionID;

      util.connection(function(err, result) {
        expect(err).not.to.exist;
        expect(result.connectionID).to.match(/\w{8}(-\w{4}){3}-\w{12}?/);
        expect(result.connectionID).not.to.equal(connectionID1);
        expect(result.close).to.be.a.function;
        result.close();
        close1();
        done();
      });
    });
  });

  it('util.agent should return a SuperAgent connected to our app', function(done) {
    var agent = util.agent();
    agent
      .get('/')
      .expect(200)
      .end(function(err, res) {
        expect(err).not.to.exist;
        done();
      });
  });
*/
  it('util.username should generate a unique username with each call', function() {
    var username1 = util.username();
    var username2 = util.username();
    expect(username1).to.be.a.string;
    expect(username2).to.be.a.string;
    expect(username1).not.to.equal(username2);
  });
//
  it('util.authenticate should signin the given user and set session.user.username', function(done) {
    var username = util.username();
    util.authenticate({username: username}, function(err, result) {
      expect(err).not.to.exist;
      expect(result.username).to.equal(username);

      // Trying to login a second time as this user will 401 if session info is set
      request.post({
        url: util.serverURL + '/mocklogin/' + username,
        jar: result.jar
      }, function(err, res, body) {
           expect(err).not.to.exist;
           expect(res.statusCode).to.equal(401);
           done();
      });
    });
  });
//
  it('util.authenticate should work with no options object passed', function(done) {
    util.authenticate(function(err, result) {
      expect(err).not.to.exist;
      expect(result.username).to.be.a.string;
      done();
    });
  });

  it('util.authenticatedConnection should signin and get a connectionID, and username', function(done) {
    util.authenticatedConnection(function(err, result) {
      expect(err).not.to.exist;
      expect(result).to.exist;
      expect(result.syncId).to.be.a.string;
      expect(result.username).to.be.a.string;
      expect(result.done).to.be.a.function;

      result.done();

      request.get({
        url: util.serverURL + '/',
        jar: result.jar
      }, function(err, res, body) {
        expect(err).not.to.exist;
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });

  it('util.syncRouteConnect should access the route in the same way as the api/sync test block when nested within authenticatedConnection', function(done) { console.log("in test");
    util.authenticatedConnection({done: done}, function(err, result1) { console.log("in authenticatedConnection");
      expect(err).not.to.exist;
      util.syncRouteConnect(result1, function(err, result2) { console.log("in syncRouteConnect cb");
        expect(result2).to.exist;
        expect(result2.statusCode).to.be.a.string;
        expect(result2.done).to.be.a.function;
        result2.done();
      });
    });
  });
});
