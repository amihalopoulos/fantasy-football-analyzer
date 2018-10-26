import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SignIn from '../components/User/login-button';
import { fetchUser, logInUser, logOutUser, isFetching } from '../actions/user.js';
import { fetchLeagueData, fetchLeagueStats } from '../actions/league.js';

export default (ChildComponent) => {
  class AuthenticatedComponent extends Component {

    componentDidMount() {
      this.props.fetchUser()
    }

    render () {
      const { user, isLoading } = this.props
      return (user && user.user && user.user.guid
        ? <ChildComponent {...this.props} />
        : ( isLoading ? <div>Loading....</div> : <SignIn /> )
      )
    }
  }

  const mapStateToProps = (state) => {
    return {
      user : state.user,
      games: state.user.games,
      league: state.league,
      leagueStats: state.leagueStats,
      isLoading: state.loadingStatus.isLoading
    };
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      fetchUser : () => {
        dispatch(fetchUser()).then(function(){dispatch(isFetching({isLoading: false}))})
      },
      fetchLeagueData: leagueKey => {
        dispatch(fetchLeagueData(leagueKey)).then(function(){dispatch(isFetching({isLoading: false}))})
      },
      logOutUser : () => {
        dispatch(logOutUser()).then(function(){dispatch(isFetching({isLoading: false}))})
      }
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent)
}