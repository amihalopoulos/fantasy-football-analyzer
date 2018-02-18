import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import UserContainer from '../components/User/user-profile-container';
import SignIn from '../components/User/login-button';
import { fetchUser } from '../actions/user.js';


export default (ChildComponent) => {
  class AuthenticatedComponent extends Component {
    // static defaultProps = {
    //   hasAuthToken: false,
    // }
    constructor(props) {
      super(props);
      this.state = {
        hasAuthToken : false,
        user: this.props.user
      }
    }

    componentDidMount() {
      this.props.fetchUser();
    }

    componentWillReceiveProps(nextProps) {
      console.log('state: ' + JSON.stringify(this.state, nextProps))
      this.setState({user: nextProps.user})

      this.setState({hasAuthToken: nextProps.user ? true : false})
    }

    render () {
      console.log('hasAuthToken: ' + this.props.hasAuthToken)
      console.log('state: ' + JSON.stringify(this.state))

      const { hasAuthToken, user } = this.state
      return (hasAuthToken || user
        ? <ChildComponent {...this.props} />
        : <SignIn />
      )
    }
  }

  const mapStateToProps = state => {
    return {
      user : state.user,
    };
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      fetchUser : () => {
        dispatch(fetchUser());
      }
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent)
}