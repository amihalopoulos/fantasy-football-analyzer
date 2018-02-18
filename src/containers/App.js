import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import UserContainer from '../components/User/user-profile-container';
import SignIn from '../components/User/login-button';
import { fetchUser } from '../actions/user.js';

console.log('loaded redux connected(hopefully) container')


export default (ChildComponent) => {
  class AuthenticatedComponent extends Component {
    static defaultProps = {
      hasAuthToken: false,
    }

    componentDidMount() {
      this.props.dispatch(fetchUser());
    }

    render () {
      console.log('hasAuthToken: ' + this.props.hasAuthToken)
      const { hasAuthToken } = this.props
      return (hasAuthToken
        ? <ChildComponent {...this.props} />
        : <SignIn />
      )
    }
  }

  const mapStateToProps = ({state}) => {
  return {
     state: state,
  };
}

  return connect(mapStateToProps)(AuthenticatedComponent)
}