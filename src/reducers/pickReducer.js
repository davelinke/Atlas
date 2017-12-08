import ObjectTools from '../factories/ObjectTools';

const defaultState = {
    elements:[]
};
const pickReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'PICK_FULL':
        return Object.assign({}, state, {elements:action.val})
    case 'PICK_ADD':
        return Object.assign({}, state, {
          elements: [].concat(state.elements,action.val)
        });
    case 'PICK_REMOVE':
        let elements = [].concat(state.elements);
        let removalPosition = ObjectTools.getElementPosition('id',action.val,elements);
        elements.splice(removalPosition,1);

        return Object.assign({}, state, {
          elements: elements
        });
    case 'PICK_CLEAR':
        return Object.assign({}, state, {
          elements: []
        });
    default:
        return state;
  }
};

export default pickReducer;
