const info = (state={}, action) => {
  switch(action.type){
    case 'START_LOADING':
      return action.payload
    case 'STOP_LOADING':
      return action.payload
    default:
      return state
  }
}

export default info