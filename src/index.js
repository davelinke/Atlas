import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory  } from 'react-router';
import ReactDOM from 'react-dom';
import App from './components/App/';
import registerServiceWorker from './registerServiceWorker';
import store from './store';

import './styles.css';

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
