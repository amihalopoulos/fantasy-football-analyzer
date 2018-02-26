import React, { Component } from 'react';
import League from './league'

class LeaguesList extends Component{

  render() {
              // <League  key={object.league_key} name={object.name} />
      let content = null;
      if (this.props.user.games) {
        content = this.props.user.games.map(function(object) {
          return (
            <div key={object.league_key}>
              <a href="" onClick={this.props.onClick}>{object.name}</a>
            </div>
          )
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