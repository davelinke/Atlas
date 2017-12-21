import {merge} from 'lodash';
const defaultState = {
    active:true
};

const undosReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'UNDO_DEACTIVATE':
            return merge({}, state, {
                active: false
            })
        case 'UNDO_ACTIVATE':
            return merge({}, state, {
                active: true
            })
        default:
            return state;
    }
};

export default undosReducer;
