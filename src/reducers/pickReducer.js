const defaultState = {
    elements:[]
};
const pickReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'PICK_ADD':
        return Object.assign({}, state, {
          elements: [].concat(state.elements,action.val)
        });
    case 'PICK_REMOVE':
        return Object.assign({}, state, {
          gridSize: action.val
        });
    case 'PICK_CLEAR':
        return Object.assign({}, state, {
          elements: []
        });
    default:
        return state;
  }
};

export default pickReducer;
