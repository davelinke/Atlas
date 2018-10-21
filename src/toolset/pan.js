import store from '../store'

export default {
    iconClass:'material-icons',
    iconString:'pan_tool',
    cursor:'move',
    initialize:function(){
        let state = store.getState();
        let zoomInstance = state.public.zoomInstance;

        zoomInstance.setPanButton(0);
    },
    destroy:function(){
        let state = store.getState();
        let zoomInstance = state.public.zoomInstance;

        zoomInstance.setPanButton(1);
    },
    mousedown:(args)=>{
    },
    mousemove:(args)=>{
    },
    mouseup:(args)=>{
    }
}
