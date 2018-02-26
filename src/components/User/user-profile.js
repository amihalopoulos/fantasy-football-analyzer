import React, { Component } from 'react';

class User extends Component{

  render() {
      const text = this.props && this.props.user && this.props.user.firstName ? this.props.user.firstName : 'not logged in';

      return <div>
        {text}
      </div>
  };
}

export default User;