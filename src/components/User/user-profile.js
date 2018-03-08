import React, { Component } from 'react';

class User extends Component{

  render() {
      let text = this.props && this.props.user && this.props.user.firstName ? this.props.user.firstName + ' / Fantasy Football' : 'not logged in';
      const { leagueName } = this.props

      if (leagueName) {
        text += ' / '+ leagueName
      }
      return <div>
        {text}
      </div>
  };
}

export default User;