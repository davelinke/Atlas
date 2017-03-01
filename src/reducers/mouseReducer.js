const defaultState = {
    down:{
        x:0,
        y:0
    },
    offset:{
        x:0,
        y:0
    },
    dragDelta:{
        x:0,
        y:0
    },
    mouseDown:null,
    longPress:null,
    isDown:false
};
const mouseReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'MOUSE_DOWN':
        return Object.assign({}, state, {
            down:{
                x:action.val.x,
                y:action.val.y
            }
        });
    case 'MOUSE_OFFSET':
        return Object.assign({}, state, {
            offset:{
                x:action.val.x,
                y:action.val.y
            }
        });
    case 'MOUSE_DRAG_DELTA':
        return Object.assign({}, state, {
            dragDelta:{
                x:action.val.x,
                y:action.val.y
            }
        });
    case 'MOUSE_DOWN_EVENT':
        return Object.assign({}, state, {
            mouseDown:action.val
        });
    case 'MOUSE_LONGPRESS':
        return Object.assign({}, state, {
            longPress:action.val
        });
    case 'MOUSE_IS_DOWN':
        return Object.assign({}, state, {
            isDown:action.val
        });
    default:
        return state;
  }
};

export default mouseReducer;
