import React, { Component } from 'react';
import LoginButton from './login-button';
import LogoutButton from './logout-button';
// import { Breadcrumb } from 'react-bootstrap';
import { PageHeader, ButtonToolbar, Button } from 'react-bootstrap'

class User extends Component{

  render() {
    let button;
    let buttons = [];
    let text, userStatusButton;
    if (this.props && this.props.user && this.props.user.firstName) {
      text = this.props.user.firstName + "'s Fantasy Football Dashboard"
      userStatusButton = <LogoutButton onClick={this.props.logOutUser} />
    } else {
      userStatusButton = <LoginButton />
      text = 'not logged in'
    }
    buttons.push(userStatusButton)

    return <div className="user-nav">
    <PageHeader>
      {text}
      <ButtonToolbar>
        {buttons}
      </ButtonToolbar>
    </PageHeader>
    </div>
  };
}

export default User;