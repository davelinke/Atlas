import { combineReducers, createStore } from 'redux';
import historyReducer from  './reducers/historyReducer';
import keyboardReducer from  './reducers/keyboardReducer';
import mouseReducer from  './reducers/mouseReducer';
import todosReducer from  './reducers/todosReducer';
import toolsReducer from  './reducers/toolsReducer';
import treeReducer from './reducers/treeReducer';
import undosReducer from  './reducers/undosReducer';
import workareaReducer from  './reducers/workareaReducer';
import screenReducer from  './reducers/screenReducer';


// combine reducers - Although we have one only,
// it is good to separate reducers through logical groups and then combine them.
const combinedReducers = combineReducers({
  main:todosReducer,
  workarea:workareaReducer,
  keyboard:keyboardReducer,
  mouse:mouseReducer,
  undos:undosReducer,
  tools:toolsReducer,
  tree:treeReducer,
  history:historyReducer,
  screen:screenReducer
});

// create the holy grail of truth... The Store
const store = createStore(combinedReducers);

export default store;
