import React, { Component } from 'react';
import User from './User/user-profile-container';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import requireAuthentication from '../containers/app';

class App extends Component{
    render() {
        return <div className="app-container">
        <p>hello this is app.js</p>
        <BrowserRouter>
          <Route component={requireAuthentication(User)}>
          </Route>
        </BrowserRouter>
        </div>
    };
}

export default App;