import React, { Component } from 'react';
import LoginButton from './login-button';
import LogoutButton from './logout-button';
// import { Breadcrumb } from 'react-bootstrap';

class User extends Component{

  render() {
    let button;
    let text;
    if (this.props && this.props.user && this.props.user.firstName) {
      text = this.props.user.firstName + ' / Fantasy Football'
      button = <LogoutButton onClick={this.props.logOutUser} />
    } else {
      button = <LoginButton />
      text = 'not logged in'
    }
    const { leagueName } = this.props

    if (leagueName) {
      text += ' / '+ leagueName
    }
    return <div className="user-nav">
      {text}
      {button}
    </div>
  };
}

export default User;