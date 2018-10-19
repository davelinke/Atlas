import TreeHelpers from '../factories/Tree';
import ObjectTools from '../factories/ObjectTools';
import Store from '../store';
export default {
    add:function(elementObject){
        Store.dispatch({
            type:'PICK_ADD',
            val:elementObject
        });
    },
    remove:function(elementId){
        Store.dispatch({
            type:'PICK_REMOVE',
            val:elementId
        });
    },
    clear:function(){
        Store.dispatch({
            type:'PICK_CLEAR'
        });
    },
    isInPick:function(elementId){
        let pick = Store.getState().pick.elements;
        return ObjectTools.objectAvailableByKey('id',elementId,pick);
    },
    addElementToPick:function(elementId, pick, addKey){
        // if what's clicked is not the artboard
        
        if (elementId && elementId!=='root'){

            // element initial MOUSE_POSITION
            let state = Store.getState();
            let elementData = TreeHelpers.getElementDataById(state.tree.children,elementId);
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
            let isInPick = ObjectTools.objectAvailableByKey('id',elementId,pick.elements);

            if (addKey){ // if shift is pressed
                if (isInPick){ // and the element is already selected
                    pick.remove(elementId); // deselect it
                } else { // and the element is not selected
                    pick.add(pickObject);// then select it too
                }
            } else { // if shif is not pressed
                if (!isInPick){ // and the element is not selected/active
                    pick.clear();
                    pick.add(pickObject); //then select it
                }
            }
        } else {
            let initialPick = [].concat(pick.elements);

            if (!addKey){ //if shift is not pressed
                pick.clear(); // it is the root element, so let's clear
                initialPick = [];
            }

            Store.dispatch({
                type:'PUBLIC_ADD',
                key:'initialPick',
                val:initialPick
            });
        }
    }
};
