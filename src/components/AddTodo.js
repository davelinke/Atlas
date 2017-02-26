import React, { Component } from 'react';
import store from '../store';

import './AddTodo.css';

class AddTodo extends Component {
  constructor(props) {
    super(props);
    this.addTodo = function() {
      store.dispatch({
        type: 'ADD_TODO'
      });
    };
    this.setTodoLabel = function(e) {
      store.dispatch({
        type: 'NU_LABEL',
        label: e.target.value
      });
    };
  }
  render() {
    return (
      <div className="mdl-card__actions mdl-card--border">
				<div className="card-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
					<input
						className="mdl-textfield__input"
						type="text"
						value={this.props.newTodoLabel}
						onChange={this.setTodoLabel}
						/>
					<label className="mdl-textfield__label" htmlFor="sample3">Add something to do</label>
				</div>
				<button
					disabled={!this.props.newTodoLabel}
					className="card-buton mdl-button mdl-js-button mdl-button--icon"
					onClick={this.addTodo}
				>
					<i className="material-icons">add_circle_outline</i>
				</button>
			</div>

    );
  }
};

export default AddTodo;
