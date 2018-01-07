import {merge} from 'lodash';
import MenuStructure from '../structures/Menu';

const defaultState = merge({},MenuStructure);

const menuReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'MENU_ADD_HELPER':
        let mahState = merge({},state);
        mahState.helperData[action.key]=action.value;
        return mahState;
    case 'MENU_ADD_ITEM':
        let maiState = merge({},state);
        return maiState;
    case 'MENU_TOGGLE_SUB':
        let nuState = merge({},state);
        // iterate through menu objects to see if there's any thats open
        for (const sub in nuState.menus) {
            if (sub!==action.value && nuState.menus[sub].visible===true){
                nuState.menus[sub].visible=false;
            }
        }
        nuState.menus[action.value].visible = !nuState.menus[action.value].visible;
        return nuState;
    default:
        return state;
  }
};

export default menuReducer;
