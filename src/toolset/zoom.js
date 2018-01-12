import store from '../store'

export default {
    iconClass:'material-icons',
    iconString:'search',
    cursor:'zoom-in',
    mousedown:(args)=>{
    },
    mousemove:(args)=>{

    },
    mouseup:(args)=>{
        let e = args.event;
        //console.log(args);
        let state = store.getState();
        let zoom = state.screen.zoom;

        if (e.altKey) { // zoom out
            store.dispatch({
                type:'SCREEN_ZOOM',
                val:zoom * 0.75
            });
        } else { // zoom in
            store.dispatch({
                type:'SCREEN_ZOOM',
                val:zoom / 0.75
            });
        }
    }
}
