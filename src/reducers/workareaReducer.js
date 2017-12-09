const defaultState = {
    snapToGrid:true,
    gridSize:10,
    elementClass:[]
};
const workareaReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'WORKAREA_SNAP_TO_GRID':
        return Object.assign({}, state, {
          snapToGrid: !state.snapToGrid
        });
    case 'WORKAREA_GRID_SIZE':
        return Object.assign({}, state, {
          gridSize: action.val
        });
    case 'WORKAREA_CLASS':
        return Object.assign({}, state, {
          elementClass: action.val
        });
    default:
        return state;
  }
};

export default workareaReducer;
