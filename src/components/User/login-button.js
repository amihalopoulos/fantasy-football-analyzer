import React, { Component } from 'react';

class LoginButton extends Component{

    render() {
        // return <button action="/auth/yahoo" onClick={this.props.onClick}> 
        //   Login!
        // </button>
        return <a href="/auth/yahoo">Login!</a>

    };
}

export default LoginButton;