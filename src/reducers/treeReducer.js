import ElementFactory from '../factories/Elements';

// create the default state of the model
const defaultState = {};

const treeReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    // case 'ADD_TODO':
    //   return {
    //     todos: [{
    //       label: state.newTodoLabel,
    //       done: false
    //     }].concat(state.todos),
    //     newTodoLabel: ''
    //   };
    default:
        return state;
  }
};

export default treeReducer;
