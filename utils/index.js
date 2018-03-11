var _ = require('underscore')

// export default Utils = {
var Utils = {
  normalizeTeams: function(league, stats, teamStats, user){
    console.log(user)
    var teamRosters = this.formatTeamRosters(league);
    var stats = this.flattenStats(stats);
    var teamStats = this.normalizeTeamStats(teamStats);

    return teamRosters.map(team => {
      team.roster = team.roster.map(player => {
        var playerStats = _.findWhere(stats, {player_key: player.player_key})
        player.stats = playerStats.stats;
        player.points = playerStats.points ? +playerStats.points.total : 0;
        return player
      })
      var teamPoints = _.findWhere(teamStats, {team_key: team.team_key})
      team.team_points = teamPoints ? teamPoints.points : false;
      return team
    })

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
    var teams = [];

    for (var key in rawTeams){
      if (rawTeams[key].team) {
        teams.push(rawTeams[key].team)
      }
    }

    return teams.map(team => {
      var obj = {
        team_key: team[0][0]['team_key'],
        team_id: team[0][1]['team_id'],
        name: team[0][2]['name'],
        logoUrl: team[0][5]['team_logos'][0]['team_logo']['url'],
        owner_name: team[0][19]['managers'][0]['manager']['nickname'],
        owner_guid: team[0][19]['managers'][0]['manager']['guid'],
        roster: []
      }
      var rawRoster = team[1].roster['0'].players;
      var numPlayers = Object.keys(rawRoster)
      for (var y = 0; y < numPlayers.length; y++) {
        var x = ''+y
        if (rawRoster[x] && rawRoster[x].player) {
          var player = {}
          Object.keys(rawRoster[x].player[0]).map((key, index) => {
            if (typeof rawRoster[x].player[0][key] === 'object') {
              Object.keys(rawRoster[x].player[0][key]).map((k, i) => {
                player[k] = rawRoster[x].player[0][key][k]
              })
            }
          })
          obj.roster.push(player)
        }
      }
      return obj
    })
  },
  formatLeauge: function(league){
    return league.fantasy_content.league[0];
  },
  formatLeagueSettings: function(settings){
    return {
      roster: this.formatRosterLayout(settings),
      statCategories: settings.fantasy_content.league[1].settings[0].stat_categories,
      statModifiers: settings.fantasy_content.league[1].settings[0].stat_modifiers,
      rosterCount: this.getNumRosterSpots(settings)
    }
  },
  formatRosterLayout: function(settings){
    return settings.fantasy_content.league[1].settings[0].roster_positions.filter(position => {
      return position.roster_position.position !== 'BN'
    }).map(obj => {return {pos: obj.roster_position.position, count: obj.roster_position.count}})
  },
  getNumRosterSpots: function(settings){
    var numRosterSpots = 0;
    var roster = settings.fantasy_content.league[1].settings[0].roster_positions;
    for (var i = 0; i < roster.length; i++) {
      numRosterSpots += roster[i].roster_position.count
    }
    return numRosterSpots
  },
  rankByPosition: function(teams, settings, guid){
    var positionsToRank = settings.roster

    var teams = this.groupRosterByPos(teams, positionsToRank);


    var averages = teams.map(team => {
      var final = {};
      for (var i = 0; i < positionsToRank.length; i++) {
        final[positionsToRank[i].pos] = 0;
        var totalPoints = team.ranks[positionsToRank[i].pos].reduce((total, player) => {
          return total + +player.points
        }, 0)
        final[positionsToRank[i].pos] = totalPoints;
      }
      team.averages = final
      team.currentUser = team.owner_guid === guid;

      return team
    })

    var currentTeam = _.findWhere(averages, {currentUser: true});

    var leagueRank = {}
    for (var i = 0; i < positionsToRank.length; i++) {
      leagueRank[positionsToRank[i].pos] = averages.map(team => {
        return {
          name: team.name,
          guid: team.owner_guid,
          currentUser: team.currentUser,
          averages: team.averages,
          roster: team.roster
        }
      }).sort((a,b) => {
        return b.averages[positionsToRank[i].pos] - a.averages[positionsToRank[i].pos]
      })
    }

    return averages.map(team => {
      team.rankings = {}
      for (var i = 0; i < positionsToRank.length; i++) {

        var rank = leagueRank[positionsToRank[i].pos].findIndex( teamRank => team.owner_guid == teamRank.guid)
        console.log(rank)
        team.rankings[positionsToRank[i].pos] = rank + 1
      }
      console.log(team)
      return team
    })
  },

  groupRosterByPos: function(teams, positions){
    return teams.map(team => {
      var final = {
        logoUrl: team.logoUrl,
        name: team.name,
        owner_guid: team.owner_guid,
        owner_name: team.owner_name,
        roster: team.roster,
        team_id: team.team_id,
        team_key: team.team_key,
        team_points: team.team_points,
        ranks: {}
      };
      var format = {}
      for (var i = 0; i < positions.length; i++) {
        format[positions[i]['pos']] = positions[i]['count']
      }

      for (var pos in format){
        final.ranks[pos] = {}
        final.ranks[pos] = _.filter(team.roster, function(p){
          var elig = false
          if (p.eligible_positions) {
            for (var i = 0; i < p.eligible_positions.length; i++) {
              if (p.eligible_positions[i].position === pos){
                elig = true
              }
            }
          }
          return elig
        })

      }
      return final
    })
  }
}

module.exports = Utils;