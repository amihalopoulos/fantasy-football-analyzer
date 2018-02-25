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
var api = require('./api');
var _ = require('underscore');
var MongoStore = require('connect-mongo')(session);
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

//express route
app.get(['/', '/app*'], (req, res) => {
  console.log('Serving ', req.url);

  let user = false;
  if (req.session.user) {
    user = req.session.user;
    console.log('user found:    '+ user)
  }

  res.sendFile(__dirname + '/dist/app.html');

  if (req.session.user) {
    console.log('user again')
  }
});



app.get('/user', (req, res) => {
  var user = req.session.user;
  var games = false;
  console.log("# Client Username check "+ req.session.user);

  if (user && user.guid) {
    var gamesPromise = getLeaguesPromise(user);
    gamesPromise.then(function(result){
      res.json({
        user: user,
        games: result,
      })
    }, function(err){
      console.log(err)
      res.json({
        user: user,
        games: false
      })
    }).then(function(result){
      console.log(result)
    })
  }



})

app.get('/logout', function(req, res) {
  delete req.session.user;
  res.json({user: {}});
});

function refreshAccessToken(user){
//this should return a promise that either is successful or isn't
//should we have a global user variable (let user;) that is updated here? 
  var refreshToken = user.refreshToken

  var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64'),
  };
  var dataString = 'grant_type=refresh_token&redirect_uri=oob&refresh_token='+refreshToken;
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
        console.log('WE REFRESHED THE TOKEN!!!   ' + body);
        resolve(body)
      } else {
        reject(err)
      }
    });
  })
};

function updateUserInfo(user){
  User.findOne({ guid: user.guid }, function(err, existingUser) {
    if (existingUser) {
      existingUser.accessToken = user.accessToken
      existingUser.refreshToken = user.refreshToken
      existingUser.save(function(err){})
      // req.session.user = existingUser;
      // req.session.save();
      // return res.redirect('/');
    }
  })
  return 
}

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
console.log(JSON.stringify(body))
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

app.get('/league/:leagueKey', function(req, res){
  if (!req.session.user) {
    return res.redirect('/auth/yahoo')
  }
  var user = req.session.user;
  console.log(req.params)

  // settings: "http://fantasysports.yahooapis.com/fantasy/v2/league/223.l.431/settings"
  // standings: https://fantasysports.yahooapis.com/fantasy/v2/league/223.l.431/standings
  // players: "http://fantasysports.yahooapis.com/fantasy/v2/league/223.l.431/players"
  //rosters

  //get every single roster

  var allRosterOpts = {
    url: 'https://fantasysports.yahooapis.com/fantasy/v2/league/'+req.params.leagueKey+'/teams/roster/players?format=json',
    method: 'GET',
    headers: { Authorization: 'Bearer ' + user.accessToken },
    rejectUnauthorized: false,
    json: true
  }

  request(allRosterOpts, function(err, response, body){
    console.log(body.fantasy_content.league[1].teams)
    var rawTeams = body.fantasy_content.league[1].teams;
    var count = body.fantasy_content.league[1].teams.count;

    var teams = [];
    for (var i = 0; i < count; i++) {
      var x = ''+i
      var t = rawTeams[x].team
      teams.push(t)
    }
    console.log(teams.length)
    var final = [];

    for (var i = 0; i < teams.length; i++) {
      var team = [];
      var normalized = [];
      var rawRoster = teams[i][1].roster['0'].players;
      var numPlayers = Object.keys(rawRoster)
      for (var y = 0; y < numPlayers.length; y++) {
        var x = ''+y
        if (rawRoster[x] && rawRoster[x].player) {
          var player = {}
          player.name = rawRoster[x].player[0][2].name
          normalized.push(player)
        }
      }
      final.push(normalized)
    }

    res.render('league', {
      title: 'League',
      user: req.session.user,
      roster: final
    })
  })

  var individualRosterOpts = {
    url: 'https://fantasysports.yahooapis.com/fantasy/v2/team/'+req.params.leagueKey+'.t.10/roster/players?format=json',
    method: 'GET',
    headers: { Authorization: 'Bearer ' + user.accessToken },
    rejectUnauthorized: false,
    json: true
  }

  // request(individualRosterOpts, function(err, response, body){
  //   //team[1].roster['0'].players['0'].player[0].name

  //   //normalize rosters
  //   var normalized = [];
  //   var final = [];
  //   var rawRoster = body.fantasy_content.team[1].roster['0'].players;
  //   console.log(rawRoster)
  //   var numPlayers = Object.keys(rawRoster)
  //   for (var i = 0; i < numPlayers.length; i++) {
  //     var x = ''+i
  //     if (rawRoster[x] && rawRoster[x].player) {
  //       normalized.push(rawRoster[x].player)
  //     }
  //   }
  //   for (var i = 0; i < normalized.length; i++) {
  //     var player = {}
  //     player.name = normalized[i][0][2].name
  //     final.push(player)
  //   }

  //   var roster = body.fantasy_content.team

  //   res.render('league', {
  //     title: 'League',
  //     user: req.session.user,
  //     roster: final
  //   })
  // })

})

function getLeagueInfoPromise(leaguekey){

}
// function refreshUser(user){
//   refreshAccessToken(user).then(function(result){
//     //if is successful then call this function again, if not exit whole function ==> resolve(false)
//     console.log(JSON.stringify(result))
//     // updateUserInfo(result)
//   })
// }

function getLeaguesPromise(user){
  if (!user) {
    return false
  }

  if (user && user.leagues) {
console.log('leagues have already been gotten')
    return;

  } else {

    var leaguesOptions = {
      url: 'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=371/leagues?format=json',
      method: 'GET',
      headers: { Authorization: 'Bearer ' + user.accessToken },
      rejectUnauthorized: false,
      json: true
    }

    return new Promise(function(resolve, reject){
      request(leaguesOptions, function(err, response, body){
        if (err) {
          reject(err)
        } else {
          if (body.error) {
            console.log(' ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR ' + JSON.stringify(body.error))
            // refreshUser(user)
            refreshAccessToken(user)
            .then(function(result){
              console.log('access token expired, we refreshed and now need to re-fetch leagure request')
            })
            .catch(function(err){
              console.log('tried to refresh access token, still didnt work....:  '+err)
            })
          }
          var leagues = body.fantasy_content ? body.fantasy_content.users['0'].user[1].games['0'].game[1].leagues[0].league : false;

          resolve(leagues)
        }
      })
    })
  }
}


app.get('/games', function(req, res){
  if (!req.session.user) {
    return res.redirect('/auth/yahoo')
  }
  var user = req.session.user;
  var leaguesOptions = {
    url: 'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=371/leagues?format=json',
    method: 'GET',
    headers: { Authorization: 'Bearer ' + user.accessToken },
    rejectUnauthorized: false,
    json: true
  }

  if (user && user.leagues) {

    res.render('games', {
      title: 'Games',
      user: req.session.user,
      games: user.leagues
    })

  } else {

    request(leaguesOptions, function(err, response, body){
      if (err) {
        console.log( err )
      } else {
        if (body.error) {
          console.log(body.error)
        }
        var leagues = body.fantasy_content ? body.fantasy_content.users['0'].user[1].games['0'].game[1].leagues[0].league : false;
        user = req.session.user;

        User.findOne({ guid: user.guid }, function(err, existingUser) {
          if (existingUser) {
            existingUser.leagues = leagues
            existingUser.save(function(err){
              console.log(existingUser)
            })
          }
        })


        res.render('games', {
          title: 'Games',
          user: req.session.user,
          games: leagues
        })
      }
    })
  }
});

app.listen(app.get('port'), function() {
  console.log('app listening on port ' + app.get('port'))
});
