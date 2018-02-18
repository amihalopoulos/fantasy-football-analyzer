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
      console.log('user data: ', data);
      dispatch(userLoggedIn(data))  
    })
    .catch(error => console.log('error ma fucka: ', error));
  }
}

export function userLoggedIn(results) {
    return {
        type: 'USER_LOGGED_IN',
        hasErrored: results
    };
}
