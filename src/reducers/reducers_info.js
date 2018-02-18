const info = (state={}, action) => {
  switch(action.type){
    case 'USER_LOGGED_IN':
    console.log('action')
      return action.payload
    default:
      return state
  }
}

export default info