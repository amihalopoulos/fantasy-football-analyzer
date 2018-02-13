import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import UserContainer from '../components/User/user-profile-container';
import SignIn from '../components/User/login';

export default (ChildComponent) => {
  class AuthenticatedComponent extends Component {
    static PropTypes = {
      hasAuthToken: PropTypes.bool.isRequired
    };

    render () {
      const { hasAuthToken } = this.props 
      return (hasAuthToken
        ? <ChildComponent {...this.props} />
        : <SignIn />
      )
    }
  }

  const mapStateToProps = state => (state);
  return connect(mapStateToProps)(AuthenticatedComponent);
}