import React, { Component } from 'react'
import { Table, Panel } from 'react-bootstrap'

class LeagueRankings extends Component{

  render() {
    let header = [];
    let roster = this.props.league.settings.roster.filter(pos => pos.pos.length === 2);

    header.push(<th key="team">Team</th>);

    for (var i = 0; i < roster.length; i++) {
      header.push(<th key={roster[i]['pos']}>{roster[i]['pos']}</th>)
      roster[i]
    }

    let rows = this.props.league.rankings.map( team => {

      let teamRanks = [];

      teamRanks.push(<td key={team.name}>{team.name}</td>)

      for (var i = 0; i < roster.length; i++) {
        let points = team.averages[roster[i]['pos']];
        let rank = team.rankings[roster[i]['pos']];

        teamRanks.push(<td key={roster[i]['pos']+'-'+team.name}>{`${points} (${getOrdinal(rank)})`}</td>)
        roster[i]
      }

      return (
        <tr key={team.name +'-row'}>
          {teamRanks}
        </tr>
      )
    })

    return (
      <div>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              {header}
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
      </div>
    )
  };
}

function getOrdinal( n ) {
    var s = ['th', 'st', 'nd', 'rd'], v;
    if ( !n ) {
      return '';
    }
    n = Math.floor( n );
    v = +n % 100;
    if (isNaN(v)) {
      return n
    }
    return +n + ( s[(v-20)%10] || s[v] || s[0] );
  }

export default LeagueRankings;