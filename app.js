"use strict";

var express = require('express');
var env = require('./environment.json');
var path = require('path');
var qs = require('querystring');
var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var _ = require('underscore');
var MongoStore = require('connect-mongo')(session);
var Utils = require('./utils');
var app;

//MongoDB
var userSchema = new mongoose.Schema({
  guid: String,
  email: String,
  profileImage: String,
  firstName: String,
  lastName: String,
  accessToken: String,
  refreshToken: String
});
var User = mongoose.model('User', userSchema);
var clientId = process.env.CLIENT_ID || env.client_id;
var clientSecret = process.env.CLIENT_SECRET || env.client_secret;
var redirectUri = process.env.REDIRECT_URI || 'http://alexei.com/auth/yahoo/callback';
mongoose.connect(process.env.MONGODB || 'localhost');
var db = mongoose.connection;
db.once('open', function (callback) {
  console.log("# Mongo DB:  Connected to server");
});

// Setup Express app
app = express();
app.set('port', process.env.PORT || 80 );
//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: db })
}));
app.use(express.static(path.join(__dirname, './dist')));


let globUser;


//express routes
app.get(['/', '/app*'], (req, res) => {
  console.log('Serving ', req.url);
  res.sendFile(__dirname + '/dist/app.html');
});

app.get('/user', (req, res) => {
  var user = req.session.user;
  globUser = user;
  var games = false;

  if (user && user.guid) {
    var gamesPromise = yahooPromise('https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=371/leagues?format=json');
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

app.get('/logout', function(req, res) {
  delete req.session.user;
  globUser = undefined;
  res.json({user: {}});
});

app.get('/league/:leagueKey', function(req, res){
  console.log('FETCHING LEAGUE INFO...')
    
  var leagueInfo = yahooPromise('https://fantasysports.yahooapis.com/fantasy/v2/league/'+req.params.leagueKey+'/teams/roster/players/?format=json');
  leagueInfo.then(function(result){
    var numTeams = result.fantasy_content.league[0].num_teams;
    var numRequests = Math.ceil((numTeams*16)/25);
    var statsRequests = [];

    for (var i = 0; i < numRequests+1; i++) {
      statsRequests.push(yahooPromise('https://fantasysports.yahooapis.com/fantasy/v2/league/'+req.params.leagueKey+'/players;status=T;start='+i*25+'/stats?format=json'))
    }

    var teamStatRequests = [];
    var teams = result.fantasy_content.league[1].teams;
    for (var key in teams){
      if (key !== 'count') {
        teamStatRequests.push(yahooPromise('https://fantasysports.yahooapis.com/fantasy/v2/team/'+teams[key].team[0][0].team_key+'/stats;type=season?format=json'))
      }
    }

    Promise.all(statsRequests).then(function(data){
      Promise.all(teamStatRequests).then(function(d){
        res.json({
          league: result,
          stats: data,
          teamStats: d
        })
      })

    }).catch(function(error){
      console.log(error)
      res.json({
        user: user,
        games: false
      })
    })
  })
})

//Oauth
app.get('/auth/yahoo', function(req, res) {
  console.log('auth/yahoo route hit....')
  var authorizationUrl = 'https://api.login.yahoo.com/oauth2/request_auth';

  var queryParams = qs.stringify({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code' //'token'?
  });

  res.redirect(authorizationUrl + '?' + queryParams);
});

app.get('/auth/yahoo/callback', function(req, res) {
  var accessTokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';

  var options = {
    url: accessTokenUrl,
    headers: { Authorization: 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64') },
    rejectUnauthorized: false,
    json: true,
    form: {
      code: req.query.code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }
  };

  // 1. Exchange authorization code for access token.
  request.post(options, function(err, response, body) {
    var guid = body.xoauth_yahoo_guid;
    var accessToken = body.access_token;
    var refreshToken = body.refresh_token;
    var socialApiUrl = 'https://social.yahooapis.com/v1/user/' + guid + '/profile?format=json';
    var options = {
      url: socialApiUrl,
      headers: { Authorization: 'Bearer ' + accessToken },
      rejectUnauthorized: false,
      json: true
    };

    // 2. Retrieve profile information about the current user.
    request.get(options, function(err, response, body) {

      // 3. Create a new user account or return an existing one.
      User.findOne({ guid: guid }, function(err, existingUser) {
        if (existingUser) {
          existingUser.accessToken = accessToken
          existingUser.refreshToken = refreshToken
          existingUser.save(function(err){
            // req.session.user = existingUser;
          })
          req.session.user = existingUser;
          req.session.save();
          return res.redirect('/');
        }

        var user = new User({
          guid: guid,
          email: body.profile.emails[0].handle,
          profileImage: body.profile.image.imageUrl,
          firstName: body.profile.givenName,
          lastName: body.profile.familyName,
          accessToken: accessToken,
          refreshToken: refreshToken
        });

        user.save(function(err) {
          req.session.user = user;
          req.session.save();
          res.redirect('/');
        });
      });
    });
  });
});

function retryOnce(func, recoverFunc){
  return func()
    .catch( err => {
      console.log('failed, trying recovery once...')
      return recoverFunc(err).then(() => func())
    })
}

function promiseRequest(requestOpts){
  console.log('requesting...' + requestOpts.url)
  requestOpts.headers.Authorization += globUser.accessToken;
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
  var dataString = 'grant_type=refresh_token&redirect_uri=oob&refresh_token='+globUser.refreshToken;
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

function yahooPromise(url){
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
  }, refreshAccessToken)
}

app.listen(app.get('port'), function() {
  console.log('app listening on port ' + app.get('port'))
});
