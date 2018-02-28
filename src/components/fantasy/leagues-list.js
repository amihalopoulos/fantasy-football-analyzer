import React, { Component } from 'react';
import LeagueListItem from './league-list-item'

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
              // <League  key={object.league_key} name={object.name} />
      let content = null;
      if (this.props.user.games) {
        content = this.props.user.games.map(function(object) {
          return <LeagueListItem  key={object.league_key} {...object} onClick={() => this.selectLeague(object.league_key)}/>
          // return (
          //   <div key={object.league_key}>
          //     <a href="" onClick={selectFunc}>{object.name}</a>
          //   </div>
          // )
        }, this)
      } else {
        content = <div>no league!</div>
      }
      return <div>
        <div>Choose a League</div>
        {content}
      </div>
  };
}

export default LeaguesList;