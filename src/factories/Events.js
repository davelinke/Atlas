export default {
    sendEvent:function(args,tools){
        args.e.type = args.theEvent;
        if (typeof(tools.set[tools.current][args.theEvent])==='function') tools.set[tools.current][args.theEvent]({
            event:args.e
        });
        //if (args.e.type!=='mousemove') console.log(args.e.type, state());
    }
}
