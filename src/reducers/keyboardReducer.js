const defaultState = {
    shift:false
};
const keyboardReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'SHIFT':
        return Object.assign({}, state, {
          shift: !state.shift
        });
    default:
        return state;
  }
};

export default keyboardReducer;
