const defaultState = {
    active:true
};

const undosReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'UNDO_DEACTIVATE':
            return Object.assign({}, state, {
                active: false
            })
        case 'UNDO_ACTIVATE':
            return Object.assign({}, state, {
                active: true
            })
        default:
            return state;
    }
};

export default undosReducer;
