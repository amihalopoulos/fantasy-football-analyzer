// export default Utils = {
module.exports = Utils = {
  formatLeagueInfo: function(data){
    var rawTeams = data.fantasy_content.league[1].teams;
    var count = data.fantasy_content.league[1].teams.count;
    var teams = [];
    for (var i = 0; i < count; i++) {
      var x = ''+i
      var t = rawTeams[x].team
      teams.push(t)
    }

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
    return final
  }
}