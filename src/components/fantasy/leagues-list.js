import React, { Component } from 'react';
import LeagueListItem from './league-list-item'

class LeaguesList extends Component{

  render() {
      let content = null;
      let header = null;

      if (this.props.user.user.games) {
        header = <div>Choose a League</div>
        content = this.props.user.user.games.map(function(object) {
          return <LeagueListItem  key={object.league_key} {...object} onClick={() => this.props.setLeague(object.league_key)}/>
        }, this)
      } else {
        content = <div>Couldn't find a league! Please refresh the page. </div>
      }

      return (
        <div className="league-list">
          {header}
          {content}
        </div>
      )

  };
}

export default LeaguesList;