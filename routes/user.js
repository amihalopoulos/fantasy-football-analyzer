"use strict";
var express = require('express');
var router = express.Router();
var env = require('../environment.json');

// module.exports = function(app){

//  ...

// }

router.use((req, res, next) => {
  console.log('user route....')
  next()
})

router.get('/', (req, res) => {
  console.log('USER ROUTE HIT!!!!')
  console.log(req.app.globUser)
  var user = req.session.user;
  res.user = user;
  var games = false;

  if (user && user.guid) {
    var gamesPromise = yahooPromise('https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=371/leagues?format=json', user);
    gamesPromise.then(function(result){
      let formattedLeagues = result.fantasy_content ? result.fantasy_content.users['0'].user[1].games['0'].game[1].leagues[0].league : false;

      res.json({
        user: user,
        games: formattedLeagues,
      })
    }, function(err){
      console.log(err)
      res.json({
        user: user,
        games: false
      })
    }).then(function(result){
    })
  } else {
    res.json({
      user: false
    })
  }
})


module.exports = router;

function retryOnce(func, recoverFunc){
  return func()
    .catch( err => {
      console.log('failed, trying recovery once...')
      return recoverFunc(err).then(() => func())
    })
}

function promiseRequest(requestOpts){
  console.log('requesting...' + requestOpts.url)
  requestOpts.headers.Authorization += req.aglobUser.accessToken;
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

function refreshAccessToken(user){
  var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + new Buffer(env.clientId + ':' + env.clientSecret).toString('base64'),
  };
  var dataString = 'grant_type=refresh_token&redirect_uri=oob&refresh_token='+User.refreshToken;
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
        if (globUser.accessToken !== body.accessToken) {
          globUser.accessToken = body.access_token;
          globUser.refreshToken = body.refresh_token;
        }
        resolve(body)
      } else {
        reject(err)
      }
    });
  })
};

function yahooPromise(url, user){
  var options = {
    url: url,
    method: 'GET',
    headers: { Authorization: 'Bearer ' },
    rejectUnauthorized: false,
    json: true
  }

  return retryOnce(() => {
    return promiseRequest(options)
      .then(function(results){
        return results
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }, refreshAccessToken(user))
}