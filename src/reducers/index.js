import { combineReducers } from 'redux';

import user from './reducers_info';
import league from './league_info';
import loadingStatus from './loading_info'

const rootReducer = combineReducers({
  user,
  league,
  loadingStatus
});

export default rootReducer
