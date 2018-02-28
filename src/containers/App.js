import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SignIn from '../components/User/login-button';
import { fetchUser, logInUser, logOutUser } from '../actions/user.js';
import { fetchLeagueData } from '../actions/league.js';

export default (ChildComponent) => {
  class AuthenticatedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        hasAuthToken : false,
        user: {},
        games: [],
        selectedLeague: false,
        isLoading: false
      }
    }

    componentDidMount() {
      console.log('mounting...')
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

  const mapStateToProps = (state) => {
    console.log(state)
    return {
      user : state.user,
      games: state.user.games,
      league: state.league,
      selectedLeague: state.selectedLeague
    };
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      fetchUser : () => {
        dispatch(fetchUser());
      },
      fetchLeagueData: leagueKey => {
        dispatch(fetchLeagueData(leagueKey));
      },
      logOutUser : () => {
        dispatch(logOutUser())
      }
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent)
}