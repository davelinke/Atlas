import Store from '../store';
export default {
    get:function(tool,key){
        let state = Store.getState();
        return state.tools.flags[tool+'_'+key];
    },
    set:function(tool,key,val){
        Store.dispatch({type:'TOOLS_FLAG',key:tool+'_'+key,val:val});
    }
}