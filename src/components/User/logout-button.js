import React, { Component } from 'react';

class LoginButton extends Component{

    render() {
        return <button onClick={this.props.onClick}> 
          Logout!
        </button>

    };
}

export default LoginButton;