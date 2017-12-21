import ObjectTools from '../factories/ObjectTools';
import {merge} from 'lodash';

const defaultState = {
    elements:[]
};
const pickReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'PICK_FULL':
        return merge({}, state, {elements:action.val})
    case 'PICK_ADD':
        return merge({}, state, {
          elements: [].concat(state.elements,action.val)
        });
    case 'PICK_REMOVE':
        let elements = [].concat(state.elements);
        let removalPosition = ObjectTools.getElementPosition('id',action.val,elements);
        elements.splice(removalPosition,1);

        return merge({}, state, {
          elements: elements
        });
    case 'PICK_CLEAR':
        return merge({}, defaultState);
    default:
        return state;
  }
};

export default pickReducer;
