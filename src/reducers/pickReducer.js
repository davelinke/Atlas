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
        var elements = [].concat(state.elements);
        elements.splice(elements.indexOf(action.val),1);
        return Object.assign({}, state, {
          elements: elements
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
