import React, { Component } from 'react';
import LoginButton from './login-button';
import LogoutButton from './logout-button';
import User from './user-profile';
import LeaguesList from '../fantasy/leagues-list'

class UserProfileContainer extends Component{

  render() {
    const isLoggedIn = this.props.user;
    let button = null;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.props.logOutUser} />
    } else {
      button = <LoginButton />
    }

    let league = this.props.league.league ? this.props.league.league.fantasy_content.league['0'].name : false

    return <div>
      <User user={this.props.user.user} leagueName={league}/>
      <LeaguesList {...this.props}/>

      {button}
    </div>
  };
}

export default UserProfileContainer;