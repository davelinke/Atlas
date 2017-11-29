import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory  } from 'react-router';
import ReactDOM from 'react-dom';
import App from './components/App/';
import registerServiceWorker from './registerServiceWorker';
import store from './store';

import './styles.css';

// create the constant that maps the sate to a variable for connection
// const mapStateToProps = function(store) {
//   //return store.main;
//   return {
//     main:store.main,
//     workarea:store.workarea,
//     keyboard:store.keyboard,
//     library:store.library,
//     mouse:store.mouse,
//     undos:store.undos,
//     tools:store.tools,
//     tree:store.tree,
//     history:store.history,
//     screen:store.screen
//   };
// }

// create the new Connected App element element with the connected redux component
//const Caps = connect(mapStateToProps)(App);

// init and render to DOM function
const initialize = () => ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App} />
    </Router>
  </Provider>,
  document.getElementById('root')
);

// initialize
initialize();
registerServiceWorker();
