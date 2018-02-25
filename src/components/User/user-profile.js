import React, { Component } from 'react';

class User extends Component{

  render() {
      const text = this.props && this.props.firstName ? this.props.firstName : 'not logged in';

      return <div>
        {text}
      </div>
  };
}

export default User;