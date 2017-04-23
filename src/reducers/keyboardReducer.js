const defaultState = {
    shift:false
};
const keyboardReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'KEYBOARD_SHIFT':
        return Object.assign({}, state, {
          shift: action.val
        });
    default:
        return state;
  }
};

export default keyboardReducer;
