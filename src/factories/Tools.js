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
            let target = args.event.target;
            let elementId = target.dataset.elementId;
            let shiftKey = args.event.shiftKey;

            if (!shiftKey){ //if shift is not pressed
                args.pick.clear(); // then clear selections cause we are to pick something new
            }
            // if what's clicked is not the artboard
            if (elementId!=='root'){
                // let's see if it's already selected
                let isInPick = args.pick.elements.indexOf(elementId)>-1?true:false;
                if (shiftKey){ // if shift is pressed
                    if (isInPick){ // and the element is already selected
                        args.pick.remove(elementId); // deselect it
                    } else { // and the element is not selected
                        args.pick.add(elementId);// then select it too
                    }
                } else { // if shif is not pressed
                    if (!isInPick){ // and the element is not selected/active
                        args.pick.add(elementId); //then select it
                    }
                }
            }
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
