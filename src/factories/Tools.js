//import Elements from './Elements';
import {workareaSettings as settings } from '../structures/Config';
export default {
    selection:{
        iconClass:'fa fa-mouse-pointer',
        longpress:function(){
            //console.log('selection longpress');
        },
        mousemove:function(args){
            console.log(args);
            let e = args.event;
            let target = e.target;
            let pick = args.pick.elements;
            let pickLength = pick.length;
            let pickEmpty = (pickLength===0);
            let noLayers = true;
            let downFlag = true;

            if (!pickEmpty) {
                // resize or move
                let resizeFlag = false;
            }
        },
        mousedown:function(args){
            let target = args.event.target;
            let elementId = target.dataset.id;
            let shiftKey = args.event.shiftKey;

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
                        args.pick.clear();
                        args.pick.add(elementId); //then select it
                    }
                }
            } else {
                if (!shiftKey){ //if shift is not pressed
                    args.pick.clear(); // it is the root element, so let's clear
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
