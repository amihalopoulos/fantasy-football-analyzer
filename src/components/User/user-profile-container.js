import React, { Component } from 'react';
import LoginButton from './login-button';
import LogoutButton from './logout-button';
import User from './user-profile';
import LeaguesList from '../fantasy/leagues-list'
import League from '../fantasy/league'

class UserProfileContainer extends Component{
  constructor(props) {
    super(props);
    this.state = {
      league: false
    }
  }

  componentDidUpdate(prevProps){
    console.log('updated', this.props)
    if (this.props.league && this.props.league.leagueKey && !this.props.league.leagueKey && !this.state.league) {
      console.log('fetching league')

      this.props.fetchLeagueData(this.props.league.leagueKey)
      this.setState({
        league: this.props.league.leagueKey
      })
    }
  }

  render() {
    const isLoggedIn = this.props.user;
    let button = null;

    // if (isLoggedIn) {
    //   button = <LogoutButton onClick={this.props.logOutUser} />
    // } else {
    //   button = <LoginButton />
    // }

    let league = this.props.league ? this.props.league.leagueKey : (this.props.league ? this.props.league.leagueKey : false);
      // {button}
    let leagueContent = league ? <League name={'alexei'} {...this.props}/> : <LeaguesList {...this.props}/>;

    return <div>
      <User user={this.props.user.user} logOutUser={this.props.logOutUser} leagueName={league}/>
      {leagueContent}

    </div>
  };
}

export default UserProfileContainer;