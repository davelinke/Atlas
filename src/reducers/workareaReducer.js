import {merge} from 'lodash';
const defaultState = {
    snapToGrid:false,
    gridSize:10,
    cursor:'default',
    elementClass:[],
    rootElement:null
};
const workareaReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'WORKAREA_CURSOR':
        return merge({}, state, {cursor:action.val});
    case 'WORKAREA_SNAP_TO_GRID':
        return merge({}, state, {
          snapToGrid: !state.snapToGrid
        });
    case 'WORKAREA_GRID_SIZE':
        return merge({}, state, {
          gridSize: action.val
        });
    case 'WORKAREA_CLASS':
        return merge({}, state, {
          elementClass: action.val
        });
    default:
        return state;
  }
};

export default workareaReducer;
