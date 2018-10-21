import { Artboard } from '../structures/Element';
import { merge } from 'lodash';
// create the default state of the model
const defaultState = merge({},Artboard);

const treeReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'TREE_ELEMENTS':
        return merge({},state.tree);
    case 'TREE_FULL':
        return merge({},action.val);
    default:
        return state;
  }
};

export default treeReducer;


