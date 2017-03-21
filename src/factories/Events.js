import Tools from './Tools';
export default {
    sendEvent:function(args,currentTool){
        args.e.type = args.theEvent;
        if (typeof(Tools[currentTool][args.theEvent])==='function') Tools[currentTool][args.theEvent]({
            event:args.e
        });
        //if (args.e.type!=='mousemove') console.log(args.e.type, state());
    }
}
