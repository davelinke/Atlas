import {merge} from 'lodash';
import TreeHelpers from '../factories/Tree';
import ObjectTools from '../factories/ObjectTools';
import PickHelpers from '../factories/Pick';
import Store from '../store';

export default {
    iconClass:'custom_icons selection',
    iconString:'',
    cursor:'default',
    willMove:false,
    dragSelect:false,
    active:false,
    resizeDirection:false,
    areaWindow:false,
    mousedown:(args)=>{
        let mouseButton = args.event.button;

        if ((mouseButton===0)){
            this.a.active = true;
            let target = args.event.target;
            let elementId = target.dataset.id;
            let addKey = args.event.shiftKey;
            let state = Store.getState();

            this.a.willMove = target.dataset.move;
            this.a.resizeDirection = target.dataset.resize;

            // BOOM
            PickHelpers.addElementToPick(elementId, args.pick, addKey);
            
            // if what's clicked is not the artboard
            if (!elementId){
                // we should be dragselecting then
                this.a.dragSelect = true;

                let areaWindow;
                if (!this.a.areaWindow) {
                    areaWindow = document.createElement('div');
                    areaWindow.setAttribute('class','area-window');
                    areaWindow.style.position='absolute';
                    areaWindow.style.border="1px dashed #ccc";
                    areaWindow.style.pointerEvents = 'none';
                    areaWindow.style.boxSizing = 'border-box';

                    document.getElementById('els_root').appendChild(areaWindow);

                    this.a.areaWindow = areaWindow;
                } else {
                    areaWindow = this.a.areaWindow;
                }

                // lets get the coordinates
                let mouse = state.mouse;

                areaWindow.style.top = mouse.offsetDown.y + 'px';
                areaWindow.style.left = mouse.offsetDown.x + 'px';
                areaWindow.style.opacity = 1;
                areaWindow.style.width=0;
                areaWindow.style.height=0;
            }
        }
    },
    mousemove:(args)=>{
        if (this.a.active){
            let state = Store.getState();
            let mouse = state.mouse;

            let delta = {
                x:(mouse.offsetDown.x - mouse.offset.x),
                y:(mouse.offsetDown.y - mouse.offset.y)
            };
            let nuTree = merge({},state.tree);
            let pick = args.pick.elements;

            if (!this.a.dragSelect) {
                let pickLength = pick.length;
                let pickEmpty = (pickLength===0);
                if (!pickEmpty) {
                    // calculate the delta
                    for (let pickElement of pick){
                        // get element id within pick
                        let currentElement = TreeHelpers.getElementDataById(nuTree.children,pickElement.id);
                        // get the state of the element (diverse css style)
                        let currentState = currentElement.currentState;
                        // get the element style in current state
                        let ess = currentElement.states[currentState].style;
                        // will it move? (resize 0, move 1)
                        if (this.a.willMove==='1'){
                            // calculate new coords
                            ess.left = pickElement.left - delta.x;
                            ess.top = pickElement.top - delta.y;
                        } else {
                            // let's check how it will resize (depending on the quadrant chosen)
                            let resizeDir = this.a.resizeDirection;
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
                                case('se'): //resize southeast
                                    ess.height = pickElement.height - delta.y;
                                    ess.width = pickElement.width - delta.x;
                                    break;
                                default:;
                            }
                        }
                    }
                    Store.dispatch({
                        type:'TREE_FULL',
                        val:nuTree
                    })
                }
            } else {
                // lets select by area
                // lets start by doing the selection rectangle

                let areaWindow = this.a.areaWindow;
                let ess = areaWindow.style;
                let artboardDimensions = {
                    width:nuTree.states[nuTree.currentState].style.width,
                    height:nuTree.states[nuTree.currentState].style.height
                }
                let aVal = {};

                // and we calculate the coordinates of the element
                if(delta.y<=0){ // this means the delta is positive (somehow)
                    // we fix the top side and make it grow with the delta value
                    aVal.height = (delta.y*-1);
                    aVal.top = mouse.offsetDown.y;
                    aVal.bottom = false;
                } else {
                    // we fix the bottom side and make it grow with the delta value
                    // you might ask yourself why, well, if we modified top pos and height it got all wobbly on screen
                    // so it is better modify only one value and have one fixed.
                    aVal.top = false;
                    aVal.bottom = (artboardDimensions.height - mouse.offsetDown.y);
                    aVal.height = delta.y;
                }

                if(delta.x<=0){ // this means the delta is positive (somehow)
                    // we fix the left side and make it grow with the delta value
                    aVal.width = (delta.x*-1);
                    aVal.left = mouse.offsetDown.x;
                    aVal.right = false;
                } else {
                    // we fix the right side and make it grow with the delta value
                    // you might ask yourself why, well, if we modified left pos and width it got all wobbly on screen
                    // so it is better modify only one value and have one fixed.
                    aVal.right = (artboardDimensions.width - mouse.offsetDown.x);
                    aVal.left = false;
                    aVal.width = delta.x;
                }

                ess.top = aVal.top ? aVal.top + 'px':'auto';
                ess.left = aVal.left ? aVal.left + 'px':'auto';
                ess.width = aVal.width ? aVal.width + 'px':'auto';
                ess.height = aVal.height ? aVal.height + 'px':'auto';
                ess.bottom = aVal.bottom ? aVal.bottom + 'px':'auto';
                ess.right = aVal.right ? aVal.right + 'px':'auto';

                let nextPick = [];
                for (let element of nuTree.children) {
                    let eS = element.states[element.currentState].style;
                    let elementId = element.id;

                    // lets create topleft definition for when whe have bottomright

                    if (!aVal.left) {
                        aVal.left = artboardDimensions.width - aVal.right - aVal.width;
                    }
                    if (!aVal.top) {
                        aVal.top = artboardDimensions.height - aVal.bottom - aVal.height;
                    }


                    let check = {
                        x1: aVal.left                   <=   (eS.left + eS.width),
                        x2: (aVal.left + aVal.width)    >=   eS.left,
                        y1: aVal.top                    <=   (eS.top + eS.height),
                        y2: (aVal.height + aVal.top)    >=   eS.top
                    }
                    let isInArea = (check.x1&&check.x2&&check.y1&&check.y2);
                    
                    let initialPick = state.public.initialPick;
                    if (isInArea) {
                        // find out how to deselect or re-selected
                        let wasPicked = ObjectTools.objectAvailableByKey('id',elementId,initialPick);
                        
                        if (!wasPicked) {
                            let pickObject = {
                                id: elementId,
                                top:eS.top,
                                left:eS.left,
                                width:eS.width,
                                height:eS.height,
                            }
                            nextPick.push(pickObject);
                        }
                    } else {
                        // lets check if it was already at pick and add if so.
                        let startedPicked = ObjectTools.objectAvailableByKey('id',elementId,initialPick);
                        if (startedPicked) {
                            let pickObject = {
                                id: elementId,
                                top:eS.top,
                                left:eS.left,
                                width:eS.width,
                                height:eS.height,
                            }
                            nextPick.push(pickObject);
                        }
                    }
                }

                // the new pick
                Store.dispatch({
                    type:'PICK_FULL',
                    val:nextPick
                });
            }

        }
    },
    mouseup:(args)=>{
        // refresh pick
        this.a.dragSelect = false;

        if(this.a.active){
            let state = Store.getState();

            let pick = [].concat(args.pick.elements);
            let pickLength = pick.length;
            let pickEmpty = (pickLength===0);
            if (!pickEmpty) {
                let nuTree = state.tree;
                for (let pickElement of pick){
                    // calculate new coords
                    let currentElement = TreeHelpers.getElementDataById(nuTree.children,pickElement.id);
                    let currentState = currentElement.currentState;
                    pickElement.left = currentElement.states[currentState].style.left;
                    pickElement.top = currentElement.states[currentState].style.top;
                    pickElement.width = currentElement.states[currentState].style.width;
                    pickElement.height =currentElement.states[currentState].style.height;
                }
                Store.dispatch({
                    type:'PICK_FULL',
                    val:pick
                })
            } else {
                Store.dispatch({
                    type:'PUBLIC_REMOVE',
                    key:'initialPick'
                })
            }
        }
        this.a.active = false;
        let areaWindow = this.a.areaWindow;
        if (areaWindow){
            areaWindow.style.opacity=0;
        }
    }
}
