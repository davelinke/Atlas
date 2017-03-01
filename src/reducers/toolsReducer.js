const defaultState = {
    current:'selection'
}
const toolsReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'TOOLS_CURRENT':
        return Object.assign({}, state, {
          current:action.val
        });
    default:
        return state;
  }
};

export default toolsReducer;
