import React, { Component } from 'react';
import store from '../store';

// create the elements that we are going to render on screen
class ButtonDone extends Component {
  constructor(props) {
    super(props);
    this.getLabel = function(done) {
      return done ? 'check_box' : 'check_box_outline_blank'
    };
    this.toggleTodo = function() {
      store.dispatch({
        type: 'TOGGLE_TODO',
        index: this.props.todoIndex
      });
    }.bind(this);
  }
  render() {
    return (<button className="button-done mdl-list__item-secondary-action mdl-button mdl-js-button mdl-button--icon" onClick={this.toggleTodo}><i className="material-icons">{this.getLabel(this.props.done)}</i></button>);
  }
};

export default ButtonDone;
