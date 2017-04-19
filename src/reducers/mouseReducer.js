const defaultState = {
    x:0,
    y:0,
    up:{x:0,y:0},
    down:{x:0,y:0},
    offset:{x:0,y:0},
    offsetUp:{x:0,y:0},
    dragDelta:{x:0,y:0},
    canvasOffset:{x:0,y:0},
    mouseDownEvent:null,
    longPressTimeout:null,
    isDown:false,
    doubleTouch:false,
    mouseEvent:null,
};
const mouseReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'MOUSE_CANVAS_OFFSET':
        return Object.assign({}, state, {
            canvasOffset:action.val
        });
    case 'MOUSE_POSITION':
        return Object.assign({},state,action.val);
    case 'MOUSE_DOWN':
        return Object.assign({}, state, {
            down:{
                x:action.val.x,
                y:action.val.y
            }
        });
    case 'MOUSE_OFFSET':
        return Object.assign({}, state, {
            offset:action.val
        });
    case 'MOUSE_DRAG_DELTA':
        return Object.assign({}, state, {
            dragDelta:{
                x:action.val.x,
                y:action.val.y
            }
        });
    case 'MOUSE_DOWN_EVENT':
        return Object.assign({}, state, {mouseDownEvent:action.val});
    case 'MOUSE_IS_DOWN':
        return Object.assign({}, state, {isDown:action.val});
    case 'MOUSE_REGISTER_UP':
        return Object.assign({},state,action.val);
    case 'MOUSE_EVENT':
        return Object.assign({},state,{mouseEvent:action.val});
    default:
        return state;
  }
};

export default mouseReducer;
