var _ = require('underscore')

// export default Utils = {
var Utils = {
  normalizeTeams: function(league, stats, teamStats){
    var teamRosters = this.formatTeamRosters(league);
    var stats = this.flattenStats(stats);
    var teamStats = this.normalizeTeamStats(teamStats);

    // return teamRosters.map(function(roster){
    //   if (roster && roster.roster) {
    //     var newRoster = roster.roster.map(function(player){
    //       if (player && player.player_key) {
    //         var playerStats = _.findWhere(stats, {player_key: player.player_key})
    //         player.stats = playerStats.stats;
    //         player.points = playerStats.points;
    //         return player
    //       }
    //     })
    //     var teamPoints = _.findWhere(teamStats, {team_key: roster.team_key})
    //     newRoster.team_points = teamPoints ? teamPoints.points : false;
    //     return newRoster
    //   }
    // })

    for (var i = 0; i < teamRosters.length; i++) {
      for (var x = 0; x < teamRosters[i].roster.length; x++) {
        var playerStats = _.findWhere(stats, {player_key: teamRosters[i].roster[x].player_key})
        teamRosters[i].roster[x].stats = playerStats.stats;
        teamRosters[i].roster[x].points = playerStats.points;
      }
      var teamPoints = _.findWhere(teamStats, {team_key: teamRosters[i].team_key})
      teamRosters[i].team_points = teamPoints ? teamPoints.points : false;
    }
    return teamRosters

  },
  normalizeTeamStats: function(teamStats){
    var final = [];
    for (var i = 0; i < teamStats.length; i++) {
      var team = {};
      team.team_key = teamStats[i].fantasy_content.team[0][0].team_key
      team.points = teamStats[i].fantasy_content.team[1].team_points.total
      final.push(team)
    }
    return final
  },
  flattenStats: function(statArray){
    var final = [];
    for (var i = 0; i < statArray.length; i++) {
      var playerList = statArray[i].fantasy_content.league[1].players
      for (var key in playerList) {
        var player = {};
        if (playerList[key].player) {
          player.player_key = playerList[key].player[0][0].player_key
          player.player_id = playerList[key].player[0][1].player_id
          player.display_position = playerList[key].player[0][9].display_position
          player.name = playerList[key].player[0][2].name
          player.eligible_positions = playerList[key].player[0][2].eligible_positions
          player.points = playerList[key].player[1].player_points
          player.stats = playerList[key].player[1].player_stats
          final.push(player)
        } else {
          console.log('missing:', key, playerList[key])
        }
      }
    }
    return final
  },
  formatTeamRosters: function(data){
    var rawTeams = data.fantasy_content.league[1].teams;
    var count = data.fantasy_content.league[1].teams.count;
    var teams = [];
    for (var i = 0; i < count; i++) {
      var x = ''+i
      var t = rawTeams[x].team
      teams.push(t)
    }

    var finalObj = {
      leagueSettings: data.fantasy_content.league[0],
      rosters: []
    }

    var final = [];
    for (var i = 0; i < teams.length; i++) {
      var obj = {
        team_key: teams[i][0][0]['team_key'],
        team_id: teams[i][0][1]['team_id'],
        name: teams[i][0][2]['name'],
        logoUrl: teams[i][0][5]['team_logos'][0]['team_logo']['url'],
        owner_name: teams[i][0][19]['managers'][0]['manager']['nickname'],
        owner_guid: teams[i][0][19]['managers'][0]['manager']['guid'],
        roster: []
      }
      var rawRoster = teams[i][1].roster['0'].players;
      var numPlayers = Object.keys(rawRoster)
      for (var y = 0; y < numPlayers.length; y++) {
        var x = ''+y
        if (rawRoster[x] && rawRoster[x].player) {
          var player = {}
          player.name = rawRoster[x].player[0][2].name
          player.player_key = rawRoster[x].player[0][0].player_key
          player.player_id = rawRoster[x].player[0][1].player_id
          player.display_position = rawRoster[x].player[0][9].display_position
          player.position_type = rawRoster[x].player[0][12].position_type
          player.eligible_positions = rawRoster[x].player[0][13].eligible_positions
          obj.roster.push(player)
        }
      }
      final.push(obj)
    }
    return final
  }
}

module.exports = Utils;