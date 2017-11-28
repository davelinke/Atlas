//import ElementFactory from '../factories/Elements';

// create the default state of the model
const defaultState = {
    id:'root',
    label:'Artboard 1',
    children:[
        {
            id:'el1',
            label:'Element 1',
            children:[],
            currentState:0,
            states:[
                {
                    label:'base',
                    classes:['image1'],
                    text:'',
                    style:{
                        position:'absolute',
                        left:25,
                        top:35,
                        width:35,
                        height:35,
                        backgroundColor:'#fff',
                        color:'#c00'
                    }
                }
            ]
        },
        {
            id:'el2',
            label:'Element 2',
            children:[],
            currentState:0,
            states:[
                {
                    label:'base',
                    classes:[],
                    text:'',
                    style:{
                        position:'absolute',
                        left:65,
                        top:95,
                        width:35,
                        height:35,
                        backgroundColor:'#fff',
                        color:'#c00'
                    }
                }
            ]
        }
    ],
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
                backgroundColor:'#c00',
                color:'#fff'
            }
        }
    ]
};

const treeReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    // case 'ADD_TODO':
    // break;
    case 'TREE_FULL':
        return Object.assign({},action.val);
    default:
        return state;
  }
};

export default treeReducer;
