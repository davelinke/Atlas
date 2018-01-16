import store from '../store'

export default {
    iconClass:'material-icons',
    iconString:'search',
    cursor:'zoom-in',
    inputLogger:false,
    mousedown:(args)=>{
        if (!this.a.inputLogger) this.a.inputLogger = document.querySelector('.input-logger');
    },
    mousemove:(args)=>{

    },
    mouseup:(args)=>{
        let e = args.event;
        //console.log(args);
        let state = store.getState();
        let zoom = state.screen.zoom;

        //console.log(state.mouse);

        let zoomValue = (e.altKey?0.75:(1/0.75));
        let nextZoom = zoom * zoomValue
        let scaleChange = nextZoom - zoom;

        //console.log(scaleChange);



        store.dispatch({
            type:'SCREEN_ZOOM',
            val:nextZoom
        });
    }
}
