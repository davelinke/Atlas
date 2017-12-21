export const Artboard = {
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
                backgroundColor:'#ffffff',
                color:'#000000',
                transform:'rotate(0deg)',
                opacity:1,
                mixBlendMode:'normal'
            }
        }
    ]
};
export const Element = {
    id:null,
    label:null,
    type:0,
    currentState:0,
    states:[],
	locked:false,
    children:[]
};
export const State = {
    id:null,
    name:'base',
    classes:[],
    style:{},
    actions:[],
    text:''
};
export const Style = {
    position:'absolute',
    width:0,
    height:0,
    backgroundColor:'#ffffff',
    borderColor:'#000000',
    borderStyle:'solid',
    borderWidth:1,
    borderRadius:0,
    boxSizing:'border-box',
    transform:'rotate(0deg)',
    opacity:1,
    mixBlendMode:'normal'
};
