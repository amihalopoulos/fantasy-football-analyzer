export const INFO_FETCHED = 'INFO_FETCHED';

export function loadInfo(results) {
  return {
    type : INFO_FETCHED,
    payload : results
  }
}

export function fetchUser(){
  return (dispatch) => {
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
    .catch(error => console.log('error ma fucka: ', error));
  }
}

export function logInUser(){
  return (dispatch) => {
    return fetch('/auth/yahoo', {
        method: 'GET',
        credentials: 'same-origin'
      })
    .then((response) => {
      return response.json()
    })
    .then(function(data) {
      dispatch(userLoggedIn(data))  
    })
    .catch(error => console.log('error ma fucka: ', error));
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
