import {merge} from 'lodash';
const defaultState = {
    offset:{
		left:0,
		top:0
	}
}
const screenReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'SCREEN_OFFSET':
        return merge({}, state, {
          offset:action.val
        });
    default:
        return state;
  }
};

export default screenReducer;
