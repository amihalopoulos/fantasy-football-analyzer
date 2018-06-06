import React, { Component } from 'react'
import Ranking from './rankings-list'
import { Table } from 'react-bootstrap'
class LeaguesList extends Component{


  render() {
    let final;
    if (this.props.league.rankings) {
      let team = this.props.league.rankings.find(team => team.owner_guid === this.props.user.user.guid)
      let rosterFormat = this.props.league.settings.roster;
      final = rosterFormat.map(pos => {
        return (
          <tr key={pos.pos}>
            <td>{pos.pos}</td>
            <td>{team.rankings[pos.pos]}</td>
            <td>{team.averages[pos.pos]}</td>
            <td>x</td>
            <td>y</td>
          </tr>
        )
      })
    }

    return (
      <div>
        {this.props.league.league.name} 
        <div> Your league rankings by position: </div>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Position</th>
              <th>Your Rank vs League</th>
              <th>Points</th>
              <th>Best</th>
              <th>Worst</th>
            </tr>
          </thead>
          <tbody>
            {final}
          </tbody>
        </Table>
      </div>
    )
  };
}

export default LeaguesList;