export function fetchLeagueData(leagueKey){
  return (dispatch) => {
    return fetch('/league/'+leagueKey, {
        method: 'GET',
        credentials: 'same-origin'
      })
    .then((response) => {
      return response.json()
    })
    .then(function(data) {
      dispatch(fetchedLeagueData(data))  
    })
    .catch(error => console.log('error ma fucka: ', error));
  }
}

export function fetchedLeagueData(results) {
    return {
        type: 'FETCHED_LEAGUE_DATA',
        payload: results
    };
}
