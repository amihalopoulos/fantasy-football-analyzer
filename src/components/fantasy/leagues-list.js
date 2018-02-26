import React, { Component } from 'react';
import League from './league'

class LeaguesList extends Component{

  render() {
              // <League  key={object.league_key} name={object.name} />

      return (
        this.props.user.games
        ? this.props.user.games.map(function(object) {
            return (
              <div key={object.league_key}>
                <a href="" onClick={this.props.onClick}>{object.name}</a>
              </div>
            )
          }, this)
        : <div>no league!</div> 
      )
  };
}

export default LeaguesList;