import treeHelpers from '../factories/Tree';
import {merge} from 'lodash';
import store from '../store'

export default {
    iconClass:'material-icons',
    iconString:'crop_square',
    cursor:'crosshair',
    initialized:false,
    activeElement:null,
    needsCleanup:{
        right:false,
        bottom:false,
    },
    mousedown:(args)=>{
        let mouseButton = args.event.button;
        if ((mouseButton===0)){
            this.a.initialized = true;
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
            let newElement = treeHelpers.generateElement(where,'Box','box',offset);
            // we dupe the state not to interefere with the current one
            let newTree = merge({},state.tree);
            // we push the new element to the tree children.
            newTree.children.push(newElement);
            // lets save the element id for resizing while creating
            this.a.activeElement = newElement.id;
            // now we send the new tree to be re-rendered
            store.dispatch({
                type:'TREE_FULL',
                val:newTree
            });
        } else {
            args.event.preventDefault();
            args.event.stopPropagation();
        }
    },
    mousemove:(args)=>{
        if (this.a.initialized) {
            // lets get the element id of what we created
            let elementId = this.a.activeElement;
            // current state of things
            let state = store.getState();
            // we get the crrent state of the cursor
            let mouse = state.mouse;
            let screen = state.screen;
            // calculate the delta
            let delta = {
                x:(mouse.down.x - mouse.x)/screen.zoom,
                y:(mouse.down.y - mouse.y)/screen.zoom
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
                this.a.needsCleanup.bottom = false;
            } else {
                // we fix the bottom side and make it grow with the delta value
                // you might ask yourself why, well, if we modified top pos and height it got all wobbly on screen
                // so it is better modify only one value and have one fixed.
                delete ess.top;
                ess.bottom = artboardDimensions.height - mouse.offsetDown.y;
                ess.height = delta.y;
                this.a.needsCleanup.bottom = true;
            }

            if(delta.x<=0){ // this means the delta is positive (somehow)
                // we fix the left side and make it grow with the delta value
                ess.width = delta.x*-1;
                ess.left = mouse.offsetDown.x;
                delete ess.right
                this.a.needsCleanup.right = false;
            } else {
                // we fix the right side and make it grow with the delta value
                // you might ask yourself why, well, if we modified left pos and width it got all wobbly on screen
                // so it is better modify only one value and have one fixed.
                ess.right = artboardDimensions.width - mouse.offsetDown.x;
                delete ess.left;
                ess.width = delta.x;
                this.a.needsCleanup.right = true;
            }
            // we send our new lovely tree to the dispatcher
            store.dispatch({
                type:'TREE_FULL',
                val:nuTree
            })
        }
    },
    mouseup:(args)=>{
        if (this.a.initialized){
            this.a.initialized = false;
            let elementId = this.a.activeElement;
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

                if (this.a.needsCleanup.right || this.a.needsCleanup.bottom){

                    // lets get the arboard dimensions
                    let artboardDimensions = {
                        width:nuTree.states[nuTree.currentState].style.width,
                        height:nuTree.states[nuTree.currentState].style.height
                    }
                    // calculate the border sigma
                    let bordersigma = 0;
                    // if (ess.borderWidth!==undefined){
                    //     bordersigma = ess.borderWidth * 2;
                    // }
                    // we clean up
                    if (this.a.needsCleanup.right){
                        ess.left = artboardDimensions.width - ess.width - ess.right - bordersigma;
                        delete ess.right;
                    }
                    if (this.a.needsCleanup.bottom){
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
}
