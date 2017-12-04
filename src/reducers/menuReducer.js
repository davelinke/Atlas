const defaultState = {
    'menus':{
        'file':{
            'visible':false,
            'items':{
                'new':{
                    label:'New',
                    component:'MenuFileNew'
                }
            }
        },
        'edit':{
            'visible':false,
            'items':{
                'copy':{
                    label:'Copy',
                    component:'MenuEditCopy'
                }
            }
        },
        'object':{
            'visible':false
        },
        'insert':{
            'visible':false
        },
        'workspace':{
            'visible':false
        },
        'window':{
            'visible':false
        },
        'help':{
            'visible':false
        }
    }
};

const menuReducer = (state = defaultState, action) => {
  switch (action.type) {
    // remember not to mutate the state
    case 'MENU_TOGGLE_SUB':
        let nuState = Object.assign({},state);
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
