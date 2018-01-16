import store from '../store'

export default {
    iconClass:'material-icons',
    iconString:'pan_tool',
    cursor:'move',
    downScroll: false,
    inputLogger:false,
    downCoords:false,
    mousedown:(args)=>{
        if (!this.a.inputLogger) this.a.inputLogger = document.querySelector('.input-logger');
        let state = store.getState();
        this.a.downScroll = state.screen.scroll;
        this.a.downCoords = {
            x:args.event.pageX,
            y:args.event.pageY
        };
    },
    mousemove:(args)=>{
        let state = store.getState();
        let mouse = state.mouse;

        let delta = {
            x:(this.a.downCoords.x - args.event.pageX)/state.screen.zoom,
            y:(this.a.downCoords.y - args.event.pageY)/state.screen.zoom
        };

        // should i dispatch this here and pick up in the component and use a ref instead of this?
        this.a.inputLogger.scrollTop = this.a.downScroll.top + delta.y;
        this.a.inputLogger.scrollLeft = this.a.downScroll.left + delta.x;
    },
    mouseup:(args)=>{

    }
}
