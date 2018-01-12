import {merge} from 'lodash';
const defaultState = {
    offset:{
		left:0,
		top:0
	},
    zoom:1,
    scroll:{
        top:0,
        left:0
    }
}
const screenReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'SCREEN_SCROLL':
        return merge({},state,{scroll:action.val});
    case 'SCREEN_ZOOM':
        return merge({},state,{
            zoom:action.val
        })
    case 'SCREEN_OFFSET':
        return merge({}, state, {
          offset:action.val
        });
    default:
        return state;
  }
};

export default screenReducer;
