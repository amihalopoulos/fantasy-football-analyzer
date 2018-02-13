import React, { Component } from 'react';
import LoginButton from './login-button';
import LogoutButton from './logout-button';
import User from './user-profile';

class UserProfileContainer extends Component{
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;

    let button = null;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      // button = <LoginButton onClick={this.handleLoginClick} />;
      button = <LoginButton />;
    }

    return <div>
      <User isLoggedIn={this.state.isLoggedIn} />
      {button}
    </div>
  };
}

export default UserProfileContainer;