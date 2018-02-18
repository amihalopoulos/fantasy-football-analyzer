import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import UserContainer from '../components/User/user-profile-container';
import SignIn from '../components/User/login-button';
console.log('loaded redux connected(hopefully) container')
export default (ChildComponent) => {
  class AuthenticatedComponent extends Component {
    static defaultProps = {
      hasAuthToken: false,
    }

    componentDidMount() {
       fetch('/user', {
          method: 'GET',
          credentials: 'same-origin'
        })
      .then((response) => {
        console.log('fetch', response)
        return response.json()
      })
      .then(function(data) {
        console.log(data);  
      })
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