import store from '../store'

export default {
    iconClass:'material-icons',
    iconString:'search',
    cursor:'zoom-in',
    inputLogger:false,
    zoomInstance:false,
    initialize:function(){
    },
    destroy:function(){
    },
    mousedown:(args)=>{

    },
    mousemove:(args)=>{

    },
    mouseup:(args)=>{
        let state = store.getState();
        let zoomInstance = state.public.zoomInstance;
        if (args.event.button===0){
            let nextZoom = (args.event.altKey?0.75:(1/0.75));
            zoomInstance.zoomTo(args.event.clientX,args.event.clientY,nextZoom);
        }
    }
}
