import ElementStructures from '../structures/Element';
// create the default state of the model
const defaultState = Object.assign({},ElementStructures.artboard);

const treeReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'TREE_ELEMENTS':
        return Object.assign({},state.tree);
    case 'TREE_FULL':
        return Object.assign({},action.val);
    default:
        return state;
  }
};

export default treeReducer;
