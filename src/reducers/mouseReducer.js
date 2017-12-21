import {merge} from 'lodash';
const defaultState = {
    x:0,
    y:0,
    up:{x:0,y:0},
    down:{x:0,y:0},
    offset:{x:0,y:0},
    offsetUp:{x:0,y:0},
    offsetDown:{x:0,y:0},
    dragDelta:{x:0,y:0},
    mouseDownEvent:null,
    longPressTimeout:null,
    isDown:false,
    doubleTouch:false,
    mouseEvent:null,
};
const mouseReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'MOUSE_POSITION':
        return merge({},state,action.val);
    case 'MOUSE_DOWN':
        return merge({},state,action.val);
    case 'MOUSE_UP':
        return merge({},state,action.val);
    case 'MOUSE_DRAG_DELTA':
        return merge({}, state, {
            dragDelta:{
                x:action.val.x,
                y:action.val.y
            }
        });
    case 'MOUSE_DOWN_EVENT':
        return merge({}, state, {mouseDownEvent:action.val});
    case 'MOUSE_IS_DOWN':
        return merge({}, state, {isDown:action.val});
    case 'MOUSE_EVENT':
        return merge({},state,{mouseEvent:action.val});
    default:
        return state;
  }
};

export default mouseReducer;
