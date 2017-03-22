import Tools from '../factories/Tools'
const defaultState = {
    current:'selection',
    set:Tools
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
