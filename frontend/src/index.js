import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import App from './App';
import Profile from './Profile';
import SignIn from './SignIn';
import './index.css';

ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path={ '/' } component={ App }>
      <IndexRoute component={ SignIn } />
      <Route path={ '/:userId' } component={ Profile } />
    </Route>
  </Router>,
  document.getElementById('root')
);
