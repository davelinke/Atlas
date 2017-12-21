import Tools from '../factories/Tools';
import {merge} from 'lodash';
const defaultState = {
    current:'selection',
    set:Tools
}
const toolsReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'TOOLS_CURRENT':
        return merge({}, state, {
          current:action.val
        });
    default:
        return state;
  }
};

export default toolsReducer;
