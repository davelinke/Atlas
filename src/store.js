import { combineReducers, createStore } from 'redux';
import todosReducer from  './reducers/todosReducer';


// combine reducers - Although we have one only,
// it is good to separate reducers through logical groups and then combine them.
const combinedReducers = combineReducers({
  main:todosReducer
});

// create the holy grail of truth... The Store
const store = createStore(combinedReducers);

export default store;
