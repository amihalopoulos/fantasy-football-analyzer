import React, { Component } from 'react';

class LoginButton extends Component{

    render() {
        return <a className="log-out-button" href="" onClick={this.props.onClick}> 
          Logout!
        </a>

    };
}

export default LoginButton;