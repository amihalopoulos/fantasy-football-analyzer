const info = (state={}, action) => {
  switch(action.type){
    case 'FETCHED_LEAGUE_DATA':
    console.log('fetched league data ACTION')
      return action.payload
    default:
      return state
  }
}

export default info