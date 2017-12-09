const defaultState = {
    classes:[
        {
            label:'image1',
            type:'image',
            style:{
            	backgroundImage:'url(/i/grumpy-cat.jpg)',
                backgroundSize:'cover',
                backgroundPosition:'center'
            }
        },
        {
            label:'ryan',
            type:'image',
            style:{
                backgroundImage:'url(https://media.giphy.com/media/KWkBL0UgsOuqc/giphy.gif)',
                backgroundSize:'cover',
                backgroundPosition:'center'
            }
        },
        {
            label:'syle1',
            type:'class',
            style:{
                borderWidth:'3px',
                borderStyle:'solid',
                borderColor:'blue'
            }
        }
    ]
}

const libraryReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    // case 'ADD_TODO':
    // break;
    default:
        return state;
  }
};

export default libraryReducer;
