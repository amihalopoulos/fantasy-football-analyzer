import { createStore } from 'redux';
import rootReducer from '../reducers';

let store = createStore(rootReducer)

store.subscribe( () => {
  console.log('store changed', store.getState())
})