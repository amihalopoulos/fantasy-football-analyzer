import React, { Component } from 'react';
import LeagueListItem from './league-list-item'
import Utils from '../../../utils'

class LeaguesList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedLeague: this.props.selectedLeague
    };
  }

  selectLeague(leagueKey) {
    this.setState({'selectedLeague': leagueKey})
    this.props.fetchLeagueData(leagueKey)
  }

  render() {
      let content = null;
      let header = null;

      if (!this.state.selectedLeague && this.props.user.games) {
        header = <div>Choose a League</div>
        content = this.props.user.games.map(function(object) {
          return <LeagueListItem  key={object.league_key} {...object} onClick={() => this.selectLeague(object.league_key)}/>
        }, this)
      } else if (this.state.selectedLeague){
        header = <div>League Analysis</div>
        if (!this.props.league.league) {
          content = <div>Loading League ... </div>
        } else {
          console.log(this.props.league)
          var roster = Utils.normalizeTeams(this.props.league.league, this.props.league.stats, this.props.league.teamStats) 
          console.log(roster)
          console.log(Utils.rankByPosition(roster))

          content = <div>need to format league info</div>
        }
      } else {
        content = <div>Couldn't find a league!</div>
      }



      return <div className="league-list">
        {header}
        {content}
      </div>
  };
}

export default LeaguesList;