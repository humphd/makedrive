var env = require('./lib/environment');
var log = require('./lib/logger.js');

// Get list of basic auth usernames:passwords from .env (if any)
// Username/password pairs should be listed like "username1:password1,username2:password2"
var basicAuthUsers = require('querystring').parse(env.get('BASIC_AUTH_USERS'), ',', ':');
var basicAuth = require('express').basicAuth;

function generateError( code, msg ) {
  var err = new Error( msg );
  err.status = code;
  return err;
}

module.exports = {
  basicAuthHandler: basicAuth(function(user, pass) {
    for (var username in basicAuthUsers) {
      if (basicAuthUsers.hasOwnProperty(username)) {
        if (user === username && pass === basicAuthUsers[username]) {
          return true;
        }
      }
    }
    log.debug('BasicAuth authentication failed for username=%s', user);
    return false;
  }),

  authenticationHandler: function( req, res, next ) {
    var username = req.session && req.session.user && req.session.user.username;

    // If cookie session doesn't exist, check to see if data got passed in via query string
    if ( !username && !!env.get( "ALLOW_QUERY_STRING_API_SYNC" ) && req.query.username ) {
      username = req.query.username;
    }

    if( !username ) {
      return next( generateError( 401, "Webmaker Authentication Required." ) );
    }

    req.params.username = username;

    next();
  },

  crossOriginHandler: function( req, res, next ) {
    var allowedCorsDomains = env.get("ALLOWED_CORS_DOMAINS");
    if (allowedCorsDomains === "*" || allowedCorsDomains.indexOf(req.headers.origin) > -1) {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Credentials', true);
    }

    next();
  },

  errorHandler: function( err, req, res, next ) {
    if (typeof err === "string") {
      err = new Error(err);
    }

    var error = {
      message: err.message,
      status: err.status ? err.status : 500
    };

    res.status( error.status ).json( error );
  },

  fourOhFourHandler: function( req, res, next ) {
    var error = {
      message: "You found a loose thread!",
      status: 404
    };

    res.status( error.status ).json( error );
    next();
  }
};
