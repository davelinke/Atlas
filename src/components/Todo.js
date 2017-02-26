import React, { Component } from 'react';
import ButtonDone from './ButtonDone';

class Todo extends Component {
  render() {
    return (
      <div className={'mdl-list__item todo ' + (this.props.done?'done':'undone')}>
				<span className='label mdl-list__item-primary-content'>{this.props.label}</span>
				<ButtonDone
					done={this.props.done}
					todoIndex={this.props.todoIndex}
					toggleTodo={this.props.toggleTodo}
				/>
			</div>)
  }
};

export default Todo;
