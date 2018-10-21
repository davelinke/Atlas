import Tools from '../toolset/';
import { merge } from 'lodash';
const defaultState = {
    current: 'selection',
    set: Tools,
    flags: {}
}
const toolsReducer = (state = defaultState, action) => {
    let nuState = merge({}, state);
    switch (action.type) {
        // remember not to mutate the state
        case 'TOOLS_CURRENT':
            nuState.current = action.val;
            return nuState;
        case 'TOOLS_FLAG':
            nuState.flags[action.key] = action.val;
            return nuState;
        default:
            return state;
    }
};

export default toolsReducer;
