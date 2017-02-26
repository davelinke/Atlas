import React, { Component } from 'react';
import { Link } from 'react-router';
import Todo from './components/Todo';
import AddTodo from './components/AddTodo';

import './App.css';

class App extends Component {

  render() {
    return (
      <div className="demo-card-wide mdl-card mdl-shadow--2dp">
        <Link className="infoIcon" to="/info">Info</Link>
        <div className="todos-wrap">
          <div className="mdl-card__supporting-text">
            <div className="demo-list-action mdl-list">
              {
                this.props.main.todos.map(
                  (todo,i) =>
                  (<Todo key={i} todoIndex={i} label={todo.label} done={todo.done} />)
                )
              }
            </div>
          </div>
          <AddTodo newTodoLabel={this.props.main.newTodoLabel} />
        </div>
      </div>
    );
  }
};

export default App;
