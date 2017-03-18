const defaultState = {
    classes:[
        {
            label:'image1',
            style:{
            	//backgroundImage:'url(data:image/jpeg;base64,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)',
                backgroundImage:'url(http://images.nymag.com/news/business/boom-brands/business130930_grumpycat_2_560.jpg)',
                backgroundSize:'cover',
                backgroundPosition:'center'
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
