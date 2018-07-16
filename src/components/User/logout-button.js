import React, { Component } from 'react';
import { Button } from 'react-bootstrap'

class LoginButton extends Component{

    render() {
        return <Button className="log-out-button" href="" onClick={this.props.onClick}> 
          Logout!
        </Button>

    };
}

export default LoginButton;