import Tools from '../toolset/';
import {merge} from 'lodash';
const defaultState = {}
const toolsReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'PUBLIC_ADD':
        let merger = {};
        merger[action.key] = action.val
        return merge({}, state, merger);
    case 'PUBLIC_REMOVE':
        let nuPublic = merge({}, state);
        delete nuPublic[action.key];
        return nuPublic;
    default:
        return state;
  }
};

export default toolsReducer;
