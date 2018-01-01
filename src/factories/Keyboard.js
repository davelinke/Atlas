//import {merge} from 'lodash';
import store from '../store';
export default {
    '86':{ // C
        keydown:(e)=>{
            if (e.ctrlKey){

            } else {
                store.dispatch({
                    type:'TOOLS_CURRENT',
                    val:'selection'
                })
            }
        },
        keyup:(event)=>{}
    },
    '82':{ // R
        keydown:(e)=>{
            if (e.ctrlKey){

            } else {
                store.dispatch({
                    type:'TOOLS_CURRENT',
                    val:'box'
                })
            }
        },
        keyup:(event)=>{}
    }
};
