var express = require('express');
var env = require('./environment.json');
var path = require('path');
var qs = require('querystring');
var request = require('request');
var paths = require('./paths.js');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var yahooFantasy = require('yahoo-fantasy');

var app;

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
    console.log(req.session.user)
    res.render('index', {
      title: 'Home',
      user: req.session.user
    })
  });

  //Oauth
  app.get('/auth/yahoo', function(req, res) {
    var authorizationUrl = 'https://api.login.yahoo.com/oauth2/request_auth';

    var queryParams = qs.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code'
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
            req.session.user = existingUser;
            return res.redirect('/');
          }

          var user = new User({
            guid: guid,
            email: body.profile.emails[0].handle,
            profileImage: body.profile.image.imageUrl,
            firstName: body.profile.givenName,
            lastName: body.profile.familyName,
            accessToken: accessToken

          });

          user.save(function(err) {
            req.session.user = user;
            res.redirect('/');
          });
        });
      });
    });
  });
  app.get('/logout', function(req, res) {
    delete req.session.user;
    res.redirect('/');
});

// }

// configureApplication()

app.listen(app.get('port'), function() {
  console.log('app listening on port ' + app.get('port'))
});
