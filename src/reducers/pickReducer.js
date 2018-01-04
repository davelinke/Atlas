import ObjectTools from '../factories/ObjectTools';
import {merge} from 'lodash';

const defaultState = {
    elements:[]
};
const pickReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'PICK_FULL':
        let nspf = merge({}, state, {elements:action.val});
        return nspf;
    case 'PICK_ADD':
        let nspa = merge({}, state);
        nspa.elements.push(action.val);
        return nspa;
    case 'PICK_REMOVE':
        let nuState = merge({}, state);
        let removalPosition = ObjectTools.getElementPosition('id',action.val,nuState.elements);
        nuState.elements.splice(removalPosition,1);

        return nuState;
    case 'PICK_CLEAR':
        return merge({}, defaultState);
    default:
        return state;
  }
};

export default pickReducer;
