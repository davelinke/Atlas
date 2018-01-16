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
                store.dispatch({
    				type:'WORKAREA_CURSOR',
    				val:'default'
    			});
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
                });
                store.dispatch({
    				type:'WORKAREA_CURSOR',
    				val:'crosshair'
    			});
            }
        },
        keyup:(event)=>{}
    },
    '90':{ // Z
        keydown:(e)=>{
            if (e.ctrlKey){

            } else { //zoom tool
                store.dispatch({
                    type:'TOOLS_CURRENT',
                    val:'zoom'
                });
                store.dispatch({
    				type:'WORKAREA_CURSOR',
    				val:'zoom-in'
    			});
            }
        },
        keyup:(event)=>{}
    },
    '18':{
        keydown:(e)=>{
            let state = store.getState();
            if (state.tools.current==='zoom'){
                store.dispatch({
                    type:'WORKAREA_CURSOR',
                    val:'zoom-out'
                });
            }
        },
        keyup:(e)=>{
            let state = store.getState();
            if (state.tools.current==='zoom'){
                store.dispatch({
                    type:'WORKAREA_CURSOR',
                    val:'zoom-in'
                });
            }
        }
    },
    '32':{
        prevTool:false,
        keydown:(e)=>{
            let state = store.getState();
            if(state.tools.current!=='pan'){
                this.a['32'].prevTool = state.tools.current;

                store.dispatch({
                    type:'TOOLS_CURRENT',
                    val:'pan'
                });
            }
        },
        keyup:(e)=>{

            store.dispatch({
                type:'TOOLS_CURRENT',
                val:this.a['32'].prevTool
            });
        }
    }
};
