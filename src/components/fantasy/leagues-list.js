import React, { Component } from 'react';
import LeagueListItem from './league-list-item'
import League from './league'


class LeaguesList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedLeague: false
    };
  }

  selectLeague(leagueKey) {
    // this.setState({'selectedLeague': leagueKey})
    this.props.fetchLeagueData(leagueKey)
    this.setState({
      selectedLeague: leagueKey
    })
  }

  render() {
      let content = null;
      let header = null;
console.log(this.props.user)
      if (!this.state.selectedLeague && this.props.user.user.games) {
        header = <div>Choose a League</div>
        content = this.props.user.user.games.map(function(object) {
          return <LeagueListItem  key={object.league_key} {...object} onClick={() => this.selectLeague(object.league_key)}/>
        }, this)
      } else if (this.state.selectedLeague){
        console.log(this.props)
        header = <div>League Analysis</div>
        if (!this.props.league.league) {
          content = <div>Loading League ... </div>
        } else {
          content = <League name={'alexei'} {...this.props}/>
        }
      } else {
        content = <div>Couldn't find a league! Please refresh the page. </div>
      }



      return <div className="league-list">
        {header}
        {content}
      </div>
  };
}

export default LeaguesList;