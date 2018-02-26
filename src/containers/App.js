import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SignIn from '../components/User/login-button';
import { fetchUser, logInUser, logOutUser } from '../actions/user.js';

export default (ChildComponent) => {
  class AuthenticatedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        hasAuthToken : false,
        user: this.props.user,
        isLoading: false
      }
    }

    componentDidMount() {
      this.props.fetchUser()
    }

    componentWillReceiveProps(nextProps) {
      this.setState({user: nextProps.user})
    }

    render () {
      const { hasAuthToken, user } = this.state
      return (user && user.user && user.user.guid
        ? <ChildComponent {...this.props} />
        : <SignIn />
      )
    }
  }

  const mapStateToProps = state => {
    return {
      user : state.user,
      games: state.games
    };
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      fetchUser : () => {
        dispatch(fetchUser());
      },
      logInUser : () => {
        dispatch(logInUser())
      },
      logOutUser : () => {
        dispatch(logOutUser())
      }
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent)
}