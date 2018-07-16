var _ = require('underscore');
var Utils = require('./index');

_.extend( Utils, {
  retryOnce: (func, recoverFunc) => {
  return func()
    .catch( err => {
      console.log('failed, trying recovery once...')
      return recoverFunc(err).then(() => func())
    })
  },
  yahooPromise: (url, user) => {
    var options = {
      url: url,
      method: 'GET',
      headers: { Authorization: 'Bearer ' },
      rejectUnauthorized: false,
      json: true
    }

    return this.retryOnce(() => {
      return promiseRequest(options, user)
        .then(results => results)
        .catch(err => Promise.reject(err))
    }, refreshAccessToken)
  }
})

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

function refreshAccessToken(){
  var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64'),
  };
  var dataString = 'grant_type=refresh_token&redirect_uri=oob&refresh_token='+req.session.user.refreshToken;
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
        if (req.session.user.accessToken !== body.accessToken) {
          req.session.user.accessToken = body.access_token;
          req.session.user.refreshToken = body.refresh_token;
        }
        resolve(body)
      } else {
        reject(err)
      }
    });
  })
}