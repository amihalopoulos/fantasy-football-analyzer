export function fetchUser(){
  return (dispatch) => {
    dispatch(isFetching({isLoading: true}))
    return fetch('/user', {
        method: 'GET',
        credentials: 'same-origin'
      })
    .then((response) => {
      return response.json()
    })
    .then(function(data) {
      dispatch(userLoggedIn(data))
    })
    .catch(error => {
      dispatch(isFetching({isLoading: false}))
      console.log('error ma fucka: ', error)
    });
  }
}

export function logOutUser(){
  return (dispatch) => {

    return fetch('/logout', {
        method: 'GET',
        credentials: 'same-origin'
      })
    .then((response) => {
      return response.json()
    })
    .then(function(data) {
      dispatch(userLoggedOut(true))  
    })
    .catch(error => console.log('error ma fucka: ', error));
  }
}

export function fetchedLeagueData(results) {
  debugger
    return {
        type: 'FETCHED_LEAGUE_DATA',
        payload: results
    };
}
export function isFetching(results) {
    return {
        type: 'START_LOADING',
        payload: results
    };
}
export function userLoggedIn(results) {
    return {
        type: 'LOG_IN_SUCCESS',
        payload: results
    };
}

export function userLoggedOut(results) {
    return {
        type: 'LOG_OUT_SUCCESS',
        payload: results
    };
}
