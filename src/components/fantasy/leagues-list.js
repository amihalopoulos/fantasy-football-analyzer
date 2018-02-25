import React, { Component } from 'react';
import League from './league'

class LeaguesList extends Component{

  render() {
      let leagues = [];
      if (this.props.user.games) {
        console.log(this.props.user.games)
        for (var i = 0; i < this.props.user.games.length; i++) {
          // leagues.push(<League {...this.props.user.games[i]} />)
          leagues.push(<div>FF{this.props.user.games[i].season} {this.props.user.games[i].name} </div>)
        }
        // leagues = this.props.user.games.map( (game) => ( <div>FF{game.season} {game.name} </div> ) );
      }
console.log(leagues)
      return (
        this.props.user.games
        ? {leagues}
        : <div>no league! </div> 
      )
  };
}

export default LeaguesList;