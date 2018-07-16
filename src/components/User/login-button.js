import React, { Component } from 'react';
import { Button } from 'react-bootstrap'

class LoginButton extends Component{

    render() {
        return <Button href="/auth/yahoo">Login!</Button>
    };
}

export default LoginButton;