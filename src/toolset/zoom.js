import store from '../store';
import zoom from 'panzoom';

export default {
    iconClass:'material-icons',
    iconString:'search',
    cursor:'zoom-in',
    inputLogger:false,
    zoomInstance:false,
    initialize:function(){
        if (!this.inputLogger) this.inputLogger = document.querySelector('.input-logger');

        let zoomInstance = zoom(this.inputLogger,{
            smoothScroll: false
        });
        console.log(zoomInstance);

        store.dispatch({
            type:'PUBLIC_ADD',
            key:'zoomInstance',
            val:zoomInstance
        });
    },
    destroy:function(){
        let state = store.getState();
        state.public.zoomInstance.dispose();
        store.dispatch({
            type:'PUBLIC_REMOVE',
            key:'zoomInstance'
        });
    },
    mousedown:(args)=>{

    },
    mousemove:(args)=>{

    },
    mouseup:(args)=>{


        // function dispatchZoom(nextZoom){
        //     return new Promise((resolve,reject)=>{
        //         resolve(store.dispatch({
        //             type:'SCREEN_ZOOM',
        //             val:nextZoom
        //         }));
        //     });
        // };
        //
        // const zoom = async (e) => {
        //
        //     // state screen scroll values are not zoomed
        //     // state screen offset values are not zoomed
        //     // state mouse offset values are not zoomed
        //
        //     let state = store.getState();
        //     let zoom = state.screen.zoom;
        //     let artboardStyle = state.tree.states[state.tree.currentState].style;
        //     let ilStyle = window.getComputedStyle(this.a.inputLogger);
        //     let prn = function(s){
        //         return parseFloat(s.replace('px',''));
        //     };
        //     let ilDims = {
        //         height:prn(ilStyle.height)*zoom,
        //         width:prn(ilStyle.width)*zoom
        //     };
        //
        //
        //     let zoomValue = (e.altKey?0.75:(1/0.75));
        //     let nextZoom = zoom * zoomValue;
        //     let scaleChange = nextZoom - zoom;
        //
        //     let rabDims = {
        //         height:artboardStyle.height * nextZoom,
        //         width:artboardStyle.width * nextZoom
        //     };
        //
        //     // boom
        //     let zo = await dispatchZoom(nextZoom);
        //
        //     if (rabDims.height > ilDims.height) {
        //         //lo que cliqueé por el proximo zoom - lo que cliqueé por el zom de ahora
        //         this.a.inputLogger.scrollTop = -1* (this.a.inputLogger.scrollTop - ((state.mouse.offsetDown.y * nextZoom) - (state.mouse.offsetDown.y * zoom)));
        //     }
        //     if (rabDims.width > ilDims.width) {
        //         this.a.inputLogger.scrollLeft = -1* (this.a.inputLogger.scrollLeft - ((state.mouse.offsetDown.x * nextZoom) - (state.mouse.offsetDown.x * zoom)));
        //     }
        // };
        //
        //
        // zoom(args.event);
    }
}
