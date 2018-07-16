const info = (state={}, action) => {
  switch(action.type){
    case 'FETCHED_LEAGUE_DATA':
    console.log('fetched league data ACTION')
      return action.payload
    case 'LOG_IN_SUCCESS':
      return action.payload.user.league ? action.payload.user.league : {}
    default:
      return state
  }
}

export default info