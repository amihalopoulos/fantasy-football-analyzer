import React, { Component } from 'react';

class User extends Component{
  constructor(props) {
    super(props);
    console.log(this.props)
  }
  shouldComponentUpdate(nextProps) {

  }

  render() {
      const text = this.props.user && this.props.user.firstName ? this.props.user.firstName : 'not logged in';

      return <div>
        {text}
      </div>
  };
}

export default User;