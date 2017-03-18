const defaultState = {
    classes:[
        {
            label:'image1',
            style:{
            	backgroundImage:'url(/i/grumpy-cat.jpg)',
                backgroundSize:'cover',
                backgroundPosition:'center'
            }
        },
        {
            label:'syle1',
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
