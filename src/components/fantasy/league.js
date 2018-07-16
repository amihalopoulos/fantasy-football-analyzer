import React, { Component } from 'react'
import { Table, Panel } from 'react-bootstrap'
import YahooUtils from '../../../utils/yahoo'
import LeaguesList from '../fantasy/leagues-list'

class League extends Component{

  render() {
    let final;
    console.log('here in league', this.props)
    console.log(YahooUtils.weighPositions(this.props.league))
    // console.log(YahooUtils.getLeagueAverages(this.props.league.rankings, this.props.league.settings.roster))
    if (this.props.league.rankings) {
      let team = this.props.league.rankings.find(team => team.owner_guid === this.props.user.user.guid) // this used to be this.props.guid
      let rosterFormat = this.props.league.settings.roster;
      final = rosterFormat.map(pos => {
        var rks = this.props.league.rankings.map( tr => tr.averages[pos.pos]);
        let max = Math.max(...rks)
        let min = Math.min(...rks)

        return (
          <tr key={pos.pos}>
            <td>{pos.pos}</td>
            <td>{team.rankings[pos.pos]}</td>
            <td>{Math.round(team.averages[pos.pos])}</td>
            <td>{Math.round(max)}</td>
            <td>{Math.round(min)}</td>
          </tr>
        )
      })
    }

    return (
      <div>
      {/* <Panel bsStyle="primary">
        <Panel.Heading componentClass="h3">
          <Panel.Title toggle>
            My Leagues
          </Panel.Title>
        </Panel.Heading>

        <Panel.Collapse>
          <Panel.Body>
            <LeaguesList {...this.props}/>
          </Panel.Body>
        </Panel.Collapse>
      </Panel> */}

      <Panel id="collapsible-panel-example-2" bsStyle="primary" defaultExpanded>
        <Panel.Heading componentClass="h3">
          <Panel.Title toggle>
            {this.props.league.league.name}
          </Panel.Title>
        </Panel.Heading>
        
        <Panel.Collapse>
          <Panel.Body>
            Your league rankings by position:
          </Panel.Body>

          <Panel.Body>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Positional Point Rank vs League</th>
                  <th>Points(avg)</th>
                  <th>Best(avg)</th>
                  <th>Worst(avg)</th>
                </tr>
              </thead>
              <tbody>
                {final}
              </tbody>
            </Table>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>

      </div>
    )
  };
}

export default League;