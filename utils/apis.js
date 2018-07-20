var _ = require('underscore');
var Utils = require('./index');
var env = require('../environment.json');
var clientId = process.env.CLIENT_ID || env.client_id;
var clientSecret = process.env.CLIENT_SECRET || env.client_secret;
var request = require('request');

_.extend( Utils, {
  yahooPromise: (url, user) => {
    var options = {
      url: url,
      method: 'GET',
      headers: { Authorization: 'Bearer ' },
      rejectUnauthorized: false,
      json: true
    }

    return retryOnce(() => {
      return promiseRequest(options, user)
        .then(results => results)
        .catch(err => Promise.reject(err))
    }, refreshAccessToken, user)
  }
})

function retryOnce(func, recoverFunc, user){
  return func()
    .catch( err => {
      console.log('failed, trying recovery once...')
      return recoverFunc(err, user).then(() => func())
    })
}

function promiseRequest(requestOpts, user){
  console.log('requesting...' + requestOpts.url)
  requestOpts.headers.Authorization += user.accessToken;
  return new Promise(function(resolve, reject){
    request(requestOpts, function(err, res, body){
      if (err || (body && body.error)) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

function refreshAccessToken(err, user){
  var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64'),
  };
  var dataString = 'grant_type=refresh_token&redirect_uri=oob&refresh_token='+user.refreshToken;
  var options = {
      url: 'https://api.login.yahoo.com/oauth2/get_token',
      method: 'POST',
      json: true,
      headers: headers,
      body: dataString
  };
  return new Promise(function(resolve, reject){ 
    request(options, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        if (user.accessToken !== body.accessToken) {
          user.accessToken = body.access_token;
          user.refreshToken = body.refresh_token;
        }
        resolve(body)
      } else {
        reject(err)
      }
    });
  })
}

module.exports = Utils;
