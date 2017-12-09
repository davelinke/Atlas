//import ElementFactory from '../factories/Elements';

// create the default state of the model
const defaultState = {
    id:'root',
    label:'Artboard 1',
    children:[],
    currentState:0,
    states:[
        {
            label:'base',
            classes:[],
            text:'',
            style:{
                position:'relative',
                width:240,
                height:320,
                backgroundColor:'#fff',
                color:'#000'
            }
        }
    ]
};

const treeReducer = (state = defaultState, action) => {
  switch (action.type) {
    // case 'ELEMENT_STATE':
    //     var nuState = Object.assign({},state);
    //     let objectId = action.objectId;
    //     let objectState = action.objectState;
    case 'TREE_ELEMENTS':
        let nuTree = Object.assign({},state.tree);

        return nuTree;
    case 'TREE_FULL':
        return Object.assign({},action.val);
    default:
        return state;
  }
};

export default treeReducer;
