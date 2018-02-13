import React, { Component } from 'react';

class User extends Component{

  shouldComponentUpdate(nextProps) {
    console.log(this.props.isLoggedIn,  nextProps.isLoggedIn)
    return this.props.isLoggedIn !== nextProps.isLoggedIn
  }

  render() {
      const text = this.props.isLoggedIn ? 'I am logged in user' : 'not logged in';

      return <div>
        {text}
      </div>
  };
}

export default User;