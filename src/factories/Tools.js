import treeHelpers from './Tree';
import {merge} from 'lodash';
import ObjectTools from './ObjectTools';
import store from '../store'
export default {
    selection:{
        iconClass:'custom_icons selection',
        iconString:'',
        willMove:false,
        resizeDirection:false,
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
        mousemove:(args)=>{
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
                let nuTree = merge({},state.tree);
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
        mouseup:(args)=>{
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
        }
    },
    box:{
        iconClass:'material-icons',
        iconString:'crop_square',
        willMove:false,
        activeElement:null,
        needsCleanup:{
            right:false,
            bottom:false,
        },
        mousedown:(args)=>{
            // lets have a look on how things are at this point
            let state = store.getState();
            // where are we storing the new elemwnt?
            let where = state.tree.children;
            // lets get the coordinates
            let mouse = state.mouse;
            // calculate x and y in respect to workarea
            let offset = {
                top:mouse.offsetDown.y,
                left:mouse.offsetDown.x
            }
            // lets generate the element structure with the help of the tree functions
            let newElement = treeHelpers.generateElement(where,'Box',offset);
            // we dupe the state not to interefere with the current one
            let newTree = merge({},state.tree);
            // we push the new element to the tree children.
            newTree.children.push(newElement);
            // lets save the element id for resizing while creating
            this.a.box.activeElement = newElement.id;
            // now we send the new tree to be re-rendered
            store.dispatch({
                type:'TREE_FULL',
                val:newTree
            });
        },
        mousemove:(args)=>{
            // lets get the element id of what we created
            let elementId = this.a.box.activeElement;
            // current state of things
            let state = store.getState();
            // we get the crrent state of the cursor
            let mouse = state.mouse;
            // calculate the delta
            let delta = {
                x:mouse.down.x - mouse.x,
                y:mouse.down.y - mouse.y
            };
            // we create a new tree to prevent mutating the current one
            let nuTree = merge({},state.tree);
            // lets get the element data by it's id
            let currentElement = treeHelpers.getElementDataById(nuTree.children,elementId);
            // we get the current state of the element
            let currentState = currentElement.currentState;
            // we get the styles of the element
            let ess = currentElement.states[currentState].style;
            // lets get the arboard dimensions for if we have to calculate negative values (you'll see)
            let artboardDimensions = {
                width:nuTree.states[nuTree.currentState].style.width,
                height:nuTree.states[nuTree.currentState].style.height
            }

            // and we calculate the coordinates of the element
            if(delta.y<=0){ // this means the delta is positive (somehow)
                // we fix the top side and make it grow with the delta value
                ess.height = delta.y*-1;
                ess.top = mouse.offsetDown.y;
                delete ess.bottom;
                this.a.box.needsCleanup.bottom = false;
            } else {
                // we fix the bottom side and make it grow with the delta value
                // you might ask yourself why, well, if we modified top pos and height it got all wobbly on screen
                // so it is better modify only one value and have one fixed.
                delete ess.top;
                ess.bottom = artboardDimensions.height - mouse.offsetDown.y;
                ess.height = delta.y;
                this.a.box.needsCleanup.bottom = true;
            }

            if(delta.x<=0){ // this means the delta is positive (somehow)
                // we fix the left side and make it grow with the delta value
                ess.width = delta.x*-1;
                ess.left = mouse.offsetDown.x;
                delete ess.right
                this.a.box.needsCleanup.right = false;
            } else {
                // we fix the right side and make it grow with the delta value
                // you might ask yourself why, well, if we modified left pos and width it got all wobbly on screen
                // so it is better modify only one value and have one fixed.
                ess.right = artboardDimensions.width - mouse.offsetDown.x;
                delete ess.left;
                ess.width = delta.x;
                this.a.box.needsCleanup.right = true;
            }
            // we send our new lovely tree to the dispatcher
            store.dispatch({
                type:'TREE_FULL',
                val:nuTree
            })

        },
        mouseup:(args)=>{
            let elementId = this.a.box.activeElement;
            // current state of things
            let state = store.getState();
            // we create a new tree to prevent mutating the current one
            let nuTree = merge({},state.tree);
            // lets get the element data by it's id
            let currentElement = treeHelpers.getElementDataById(nuTree.children,elementId);
            // we get the current state of the element
            let currentState = currentElement.currentState;
            // we get the styles of the element
            let ess = currentElement.states[currentState].style;


            //is the width and height 0?
            // if so we erase
            if ((ess.width===0) && (ess.height ===0)){
                // find element index
                let elementIndex = nuTree.children.indexOf(currentElement);
                nuTree.children.splice(elementIndex,1);

                // we send our new lovely tree to the dispatcher
                store.dispatch({
                    type:'TREE_FULL',
                    val:nuTree
                })

            } else {
                // did we create elements by fixing bottom or right?
                // if so, lets fix that here (you know, for consistency)
                // lets get the element id of what we created

                if (this.a.box.needsCleanup.right || this.a.box.needsCleanup.bottom){

                    // lets get the arboard dimensions
                    let artboardDimensions = {
                        width:nuTree.states[nuTree.currentState].style.width,
                        height:nuTree.states[nuTree.currentState].style.height
                    }
                    // calculate the border sigma
                    let bordersigma = 0;
                    if (ess.borderWidth!==undefined){
                        bordersigma = ess.borderWidth * 2;
                    }
                    // we clean up
                    if (this.a.box.needsCleanup.right){
                        ess.left = artboardDimensions.width - ess.width - ess.right - bordersigma;
                        delete ess.right;
                    }
                    if (this.a.box.needsCleanup.bottom){
                        ess.top = artboardDimensions.height - ess.height - ess.bottom - bordersigma;
                        delete ess.bottom;
                    }

                    // we send our new lovely tree to the dispatcher
                    store.dispatch({
                        type:'TREE_FULL',
                        val:nuTree
                    })
                }
            }
        }
    }
};
