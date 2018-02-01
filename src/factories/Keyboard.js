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
    '18':{ // altKey
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
    '32':{ // spacebar
        keydown:(e)=>{
            let state = store.getState();
            if(state.tools.current!=='pan'){
                store.dispatch({
                    type:'PUBLIC_ADD',
                    key:'lastTool',
                    val:state.tools.current
                });
                //this.a['32'].prevTool = state.tools.current;
                store.dispatch({
                    type:'TOOLS_CURRENT',
                    val:'pan'
                });
                store.dispatch({
                    type:'WORKAREA_CURSOR',
                    val:state.tools.set.pan.cursor
                });
                state.tools.set.pan.initialize();
            }
        },
        keyup:(e)=>{
            let state = store.getState();
            let lastTool = state.public.lastTool;
            state.tools.set.pan.destroy();
            store.dispatch({
                type:'TOOLS_CURRENT',
                val:lastTool
            });
            store.dispatch({
                type:'WORKAREA_CURSOR',
                val:state.tools.set[lastTool].cursor
            });
            store.dispatch({
                type:'PUBLIC_REMOVE',
                key:'lastTool'
            })
            if (typeof(state.tools.set[lastTool].initialize)==='function'){
                state.tools.set[lastTool].initialize();
            }
        }
    }
};
