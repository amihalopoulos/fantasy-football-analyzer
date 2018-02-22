import React, { Component } from 'react';

class LoginButton extends Component{

    render() {
        return <a href="" onClick={this.props.onClick}> 
          Logout!
        </a>

    };
}

export default LoginButton;