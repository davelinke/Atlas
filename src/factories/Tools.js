//import Elements from './Elements';
export default {
    selection:{
        iconClass:'fa fa-mouse-pointer',
        longpress:function(){
            //console.log('selection longpress');
        },
        mousemove:function(){
            //console.log('selection mousemove');
        },
        mousedown:function(args){
            console.log(args.keys);
            var target = args.event.target;
            //if shift is pressed

            //if shift is not pressed
            args.pick.clear();
            args.pick.add(target.dataset.elementId);
            console.log(target.parentNode);
        },
        mouseup:function(){
            //console.log('selection mouseup');
        },
        mousedrag:function(){
            //console.log('selection mousedrag');
        }
    },
    box:{
        iconClass:'fa fa-square-o',
        longpress:function(){
            //console.log('box longpress');
        },
        mousemove:function(){
            //console.log('box mousemove');
        },
        mousedown:function(args){
            console.log(args);
            //console.log('box mousedown');
        },
        mouseup:function(){
            //console.log('box mouseup');
        },
        mousedrag:function(){
            console.log('box mousedrag');
        }
    }
};
