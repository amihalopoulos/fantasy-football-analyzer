import React, { Component } from 'react';
import Ranking from './rankings-list'

class LeaguesList extends Component{


  render() {
    console.log(this.props)
    let final;
    if (this.props.league.rankings) {
      let team = this.props.league.rankings.find(team => team.owner_guid === this.props.user.user.guid)
      let rosterFormat = this.props.league.settings.roster;
      final = rosterFormat.map(pos => {
        pos.pos
        return <li key={pos.pos}><div className='pos'>{pos.pos}:</div> <div className="rank">{team.rankings[pos.pos]}</div></li>
      })
    }

    console.log(final)

    return <div>
      {this.props.league.league.name} 
      <div> Your league rankings by position: </div>
      <ol className="rankings-list">
        {final}
      </ol>
    </div>
  };
}

export default LeaguesList;