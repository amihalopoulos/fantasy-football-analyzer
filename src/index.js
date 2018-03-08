import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

import App from './components/app';
import './styles/index.css';

let store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

store.subscribe( () => {
  console.log('store changed', store.getState())
})

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('container')
)
