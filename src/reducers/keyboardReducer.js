import {merge} from 'lodash';
const defaultState = {
    shift:false
};
const keyboardReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'KEYBOARD_SHIFT':
        return merge({}, state, {
          shift: action.val
        });
    default:
        return state;
  }
};

export default keyboardReducer;
