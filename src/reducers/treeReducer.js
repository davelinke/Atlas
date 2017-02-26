// create the default state of the model
const defaultState = {
  id:new Date().getTime(),
  label:'Screen 1'
  states:[{
      base:{
          classes:[]
          style:{
              width:375,
              height:559
          },
          actions:[]
      }
  }],
  children:[]
};

const treeReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    // case 'ADD_TODO':
    //   return {
    //     todos: [{
    //       label: state.newTodoLabel,
    //       done: false
    //     }].concat(state.todos),
    //     newTodoLabel: ''
    //   };
    default:
        return state;
  }
};

export default treeReducer;
