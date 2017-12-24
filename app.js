var express = require('express');
var env = require('./environment.json');
var path = require('path');
var qs = require('querystring');
var request = require('request');
var paths = require('./paths.js');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var api = require('./api');
var _ = require('underscore');
var app;

var thisAPI = new api()

console.log(thisAPI)

var userSchema = new mongoose.Schema({
  guid: String,
  email: String,
  profileImage: String,
  firstName: String,
  lastName: String,
  accessToken: String
});

var User = mongoose.model('User', userSchema);

var clientId = process.env.CLIENT_ID || env.client_id;
var clientSecret = process.env.CLIENT_SECRET || env.client_secret;
var redirectUri = process.env.REDIRECT_URI || 'http://alexei.com/auth/yahoo/callback';

// function configureApplication() {

  //MongoDB
  mongoose.connect(process.env.MONGODB || 'localhost');

  // Setup Express app
  app = express();
  app.set('port', process.env.PORT || 80 );

  //View Engine
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  // Body Parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));

  app.use(express.static(path.join(__dirname, 'app')));

  app.get('/', function(req, res) {
    var user = false;
    if (req.session.user) {
      user = req.session.user;
    }

    res.render('index', {
      title: 'Home',
      user: req.session.user,
      bodyTest: user ? user.bodyTest : 'No data'
    })
  });
// }

  //Oauth
  app.get('/auth/yahoo', function(req, res) {
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

    //get every single roster

    var opts = {
      url: 'https://fantasysports.yahooapis.com/fantasy/v2/team/'+req.params.leagueKey+'.t.10/roster/players?format=json',
      method: 'GET',
      headers: { Authorization: 'Bearer ' + user.accessToken },
      rejectUnauthorized: false,
      json: true
    }

    request(opts, function(err, response, body){
      //team[1].roster['0'].players['0'].player[0].name

      //normalize rosters
      var normalized = [];
      var final = [];
      var rawRoster = body.fantasy_content.team[1].roster['0'].players;
      console.log(rawRoster)
      var numPlayers = Object.keys(rawRoster)
      for (var i = 0; i < numPlayers.length; i++) {
        var x = ''+i
        if (rawRoster[x] && rawRoster[x].player) {
          normalized.push(rawRoster[x].player)
        }
      }
      for (var i = 0; i < normalized.length; i++) {
        var player = {}
        player.name = normalized[i][0][2].name
        // final.push(normalized[i][0])
        final.push(player)

      }
console.log(final)


      var roster = body.fantasy_content.team

      res.render('league', {
        title: 'League',
        user: req.session.user,
        roster: final
      })
    })


  })


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
          var leagues = body.fantasy_content.users['0'].user[1].games['0'].game[1].leagues[0].league;

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

  app.get('/logout', function(req, res) {
    delete req.session.user;
    res.redirect('/');
  });

app.listen(app.get('port'), function() {
  console.log('app listening on port ' + app.get('port'))
});
