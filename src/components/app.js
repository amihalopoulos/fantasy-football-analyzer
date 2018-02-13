import React, { Component } from 'react';
import User from './User/user-profile-container'

class App extends Component{
    render() {
        return <div>
            <User name="Hardcode Test" />
        </div>
    };
}

export default App;