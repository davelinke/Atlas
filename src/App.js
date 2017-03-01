import React, { Component } from 'react';
import Workarea from './components/Workarea';
//import { Link } from 'react-router';
//import Todo from './components/Todo';
//import AddTodo from './components/AddTodo';

import './App.css';

class App extends Component {

  render() {
    return (
      <div className="wrap">
          <div className="menubar">File</div>
          <div className="main">
              <div className="toolbar">A</div>
              <Workarea></Workarea>
              <div className="sidebar">Sidebar</div>
          </div>
      </div>
    );
  }
};

export default App;
