const info = (state={}, action) => {
  switch(action.type){
    case 'LOG_IN_SUCCESS':
      return action.payload
    case 'LOG_OUT_SUCCESS':
      return action.payload
    default:
      return state
  }
}

export default info