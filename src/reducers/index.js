import { combineReducers } from 'redux';

import user from './reducers_info';
import league from './league_info';


const rootReducer = combineReducers({
  user,
  league
});

export default rootReducer
