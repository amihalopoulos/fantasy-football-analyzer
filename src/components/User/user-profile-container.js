import React, { Component } from 'react';
import LoginButton from './login-button';
import LogoutButton from './logout-button';
import User from './user-profile';

class UserProfileContainer extends Component{
  constructor(props) {
    super(props);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {user: this.props.user};
  }

  handleLogoutClick() {
    this.setState({user: false});
  }

  render() {
    const isLoggedIn = this.state.user;
    let button = null;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.props.logOutUser} />
    } else {
      button = <LoginButton />
    }

    return <div>
      <User {...this.props}/>
      {button}
    </div>
  };
}

export default UserProfileContainer;