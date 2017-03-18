//import ElementFactory from '../factories/Elements';

// create the default state of the model
const defaultState = {
    id:0,
    label:'Artboard 1',
    children:[
        {
            id:1,
            label:'Element 1',
            children:[],
            currentState:0,
            states:[
                {
                    label:'base',
                    classes:['image1'],
                    text:'',
                    style:{
                        marginLeft:25,
                        marginTop:35,
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
            text:'woot',
            style:{
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
    default:
        return state;
  }
};

export default treeReducer;
