import {merge} from 'lodash';
import Keys from '../factories/Keyboard';
const defaultState = {
    shift:false,
    set:Keys
};
const keyboardReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'KEYBOARD_SHIFT':
        return merge({}, state, {
          shift: action.val
        });
    case 'KEY_COMBO':
        let kcState = merge({},state,{set:action.val});
        return kcState;
    default:
        return state;
  }
};

export default keyboardReducer;
