import Tools from './Tools';
import store from '../store';

const state = store.getState;

export default {
    sendEvent:function(args){
        args.e.type = args.theEvent;
        if (typeof(Tools[state.tools.current][args.theEvent])==='function') Tools[state.tools.current][args.theEvent]({
            event:args.e
        });
    }
}
