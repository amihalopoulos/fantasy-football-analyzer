import React, { Component } from 'react';
import LoginButton from './login-button';
import LogoutButton from './logout-button';
import User from './user-profile';
import LeaguesList from '../fantasy/leagues-list'
import { Button } from 'react-bootstrap'
import League from '../fantasy/league-rankings'

class UserProfileContainer extends Component{
  constructor(props) {
    super(props);
    this.state = {
      league: this.props.league
    }
  }

  goBack(){
    this.setState({league: false})
  }

  setLeague(leagueKey){
    this.setState({league: leagueKey})
    this.props.fetchLeagueData(leagueKey)
  }

  render() {
    const isLoggedIn = this.props.user;
    let button = null;

    let league = this.state.league ? this.state.league.leagueKey : false;
    let leagueContent = this.state.league ? <League {...this.props}/> : <LeaguesList setLeague={this.setLeague.bind(this)} {...this.props}/>;

    return (
      <div>
        <User user={this.props.user.user} logOutUser={this.props.logOutUser} leagueName={league}/>
        {this.state.league ? <Button bsStyle="primary" onClick={this.goBack.bind(this)}>Go Back</Button> : ''}
        {leagueContent}
      </div>
    )
  };
}

export default UserProfileContainer;