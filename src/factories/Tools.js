import treeHelpers from './Tree';
import ObjectTools from './ObjectTools';
import store from '../store'
export default {
    selection:{
        iconClass:'fa fa-mouse-pointer',
        willMove:false,
        resizeDirection:false,
        longpress:()=>{
            //console.log('selection longpress');
        },
        mousemove:(args)=>{
            //console.log(args);
            let e = args.event;
            let target = e.target;
            let state = store.getState();

            let pick = args.pick.elements;
            let pickLength = pick.length;
            let pickEmpty = (pickLength===0);
            if (!pickEmpty) {
                // calculate the delta
                let mouse = state.mouse;
                let delta = {
                    x:mouse.down.x - mouse.x,
                    y:mouse.down.y - mouse.y
                };
                let nuTree = Object.assign({},state.tree);
                for (let pickElement of pick){
                    let currentElement = treeHelpers.getElementDataById(nuTree.children,pickElement.id);
                    let currentState = currentElement.currentState;
                    let ess = currentElement.states[currentState].style;
                    if (this.a.selection.willMove==='1'){
                        // calculate new coords
                        ess.left = pickElement.left - delta.x;
                        ess.top = pickElement.top - delta.y;
                    } else {
                        let resizeDir = this.a.selection.resizeDirection;
                        let nextWidth,nextHeight;
                        switch (resizeDir) {
                            case('nw'):
                                nextWidth = pickElement.width + delta.x;
                                if (nextWidth>0){
                                    ess.left = pickElement.left - delta.x;
                                    ess.width = nextWidth;
                                }
                                nextHeight = pickElement.height + delta.y;
                                if (nextHeight>0){
                                    ess.top = pickElement.top - delta.y;
                                    ess.height = nextHeight;
                                }
                                break;
                            case('n'):
                                nextHeight = pickElement.height + delta.y;
                                if (nextHeight>0){
                                    ess.top = pickElement.top - delta.y;
                                    ess.height = nextHeight;
                                }
                                break;
                            case('ne'):
                                nextHeight = pickElement.height + delta.y;
                                if (nextHeight>0){
                                    ess.top = pickElement.top - delta.y;
                                    ess.height = nextHeight;
                                }
                                ess.width = pickElement.width - delta.x;
                                break;
                            case('w'):
                                nextWidth = pickElement.width + delta.x;
                                if (nextWidth>0){
                                    ess.left = pickElement.left - delta.x;
                                    ess.width = nextWidth;
                                }
                                break;
                            case('e'): //resize eastbound
                                ess.width = pickElement.width - delta.x;
                                break;
                            case('sw'):
                                ess.height = pickElement.height - delta.y;
                                nextWidth = pickElement.width + delta.x;
                                if (nextWidth>0){
                                    ess.left = pickElement.left - delta.x;
                                    ess.width = nextWidth;
                                }
                                break;
                            case('s'): //resize southbound
                                ess.height = pickElement.height - delta.y;
                                break;
                            default: //resize southeast
                                ess.height = pickElement.height - delta.y;
                                ess.width = pickElement.width - delta.x;
                        }
                    }
                }
                store.dispatch({
                    type:'TREE_FULL',
                    val:nuTree
                })
            }
        },
        mousedown:(args)=>{
            let target = args.event.target;
            let elementId = target.dataset.id;
            let shiftKey = args.event.shiftKey;
            let state = store.getState();
            let pick = args.pick.elements;

            this.a.selection.willMove = target.dataset.move;
            this.a.selection.resizeDirection = target.dataset.resize;


            // if what's clicked is not the artboard
            if (elementId && elementId!=='root'){

                // element initial MOUSE_POSITION
                let elementData = treeHelpers.getElementDataById(state.tree.children,elementId);
                let elementState = elementData.currentState;
                let stateStyle = elementData.states[elementState].style;

                let pickObject = {
                    id: elementId,
                    top:stateStyle.top,
                    left:stateStyle.left,
                    width:stateStyle.width,
                    height:stateStyle.height,
                }


                // let's see if it's already selected
                let isInPick = ObjectTools.objectAvailableByKey('id',elementId,pick);
                if (shiftKey){ // if shift is pressed
                    if (isInPick){ // and the element is already selected
                        args.pick.remove(elementId); // deselect it
                    } else { // and the element is not selected
                        args.pick.add(pickObject);// then select it too
                    }
                } else { // if shif is not pressed
                    if (!isInPick){ // and the element is not selected/active
                        args.pick.clear();
                        args.pick.add(pickObject); //then select it
                    }
                }
            } else {
                if (!shiftKey){ //if shift is not pressed
                    args.pick.clear(); // it is the root element, so let's clear
                }
            }
        },
        mouseup:(args)=>{
            //console.log('selection mouseup');
            // refresh pick
            let state = store.getState();

            let pick = [].concat(args.pick.elements);
            let pickLength = pick.length;
            let pickEmpty = (pickLength===0);
            if (!pickEmpty) {
                let nuTree = state.tree;
                for (let pickElement of pick){
                    // calculate new coords
                    let currentElement = treeHelpers.getElementDataById(nuTree.children,pickElement.id);
                    let currentState = currentElement.currentState;
                    pickElement.left = currentElement.states[currentState].style.left;
                    pickElement.top = currentElement.states[currentState].style.top;
                    pickElement.width = currentElement.states[currentState].style.width;
                    pickElement.height =currentElement.states[currentState].style.height;
                }
                store.dispatch({
                    type:'PICK_FULL',
                    val:pick
                })
            }
        },
        mousedrag:()=>{
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
