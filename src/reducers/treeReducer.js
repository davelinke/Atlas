import ElementFactory from '../factories/Elements';

// create the default state of the model
const defaultState = {};

const treeReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    // case 'ADD_TODO':
    // break;
    default:
        return state;
  }
};

export default treeReducer;
