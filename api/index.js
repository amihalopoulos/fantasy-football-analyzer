var qs = require('querystring');
var request = require('request');


var API = function(options){

}

API.prototype.fetchLeagues = function(user, cb){
    // url: 'https://fantasysports.yahooapis.com/fantasy/v2/;use_login=1//',
    console.log(user)
  var leaguesOptions = {
    url: 'https://fantasysports.yahooapis.com/fantasy/v2/;use_login=1//',
    headers: { Authorization: 'Bearer ' + user.accessToken },
    rejectUnauthorized: false,
    json: true
  }

  request.get(leaguesOptions, function(err, response, body){

    if (err) {
      console.log( err);
      cb( null, false );
      return;
    }

    var data;
    
    try {
      data = JSON.parse( body );
    } catch( e ) {
      console.log('error');
      cb( null,{
        'error': true
      });
      return;
    }

    cb(false, data)
  }.bind( this ));
}

module.exports = API;
