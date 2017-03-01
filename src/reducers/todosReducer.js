// create the default state of the model
const defaultState = {
  todos: [{
    label: 'Learn React',
    done: true
  }, {
    label: 'Learn Redux',
    done: true
  }, {
    label: 'Learn React-Redux Connect',
    done: true
  }, {
    label: 'Learn React-Router with Redux',
    done: true
  }],
  newTodoLabel: ''
};

// create the reducers that will control the model
const todosReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'ADD_TODO':
      return {
        todos: [{
          label: state.newTodoLabel,
          done: false
        }].concat(state.todos),
        newTodoLabel: ''
      };
    case 'TOGGLE_TODO':
      let nooDoos = state.todos.slice(0);
      nooDoos[action.index].done = !state.todos[action.index].done;
      return Object.assign({}, state, {
        todos: nooDoos
      });
    case 'NU_LABEL':
      return Object.assign({}, state, {
        newTodoLabel:action.label
      });
    default:
        return state;
  }
};

export default todosReducer;
