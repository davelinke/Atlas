import ElementTypes from '../structures/ElementTypes';
import ElementStructure from '../structures/Element';

const ElementFactory = {
    generateId:function(){
        return new Date().getTime();
    },
    generateLabel:function(elementType = 0){
        return ElementTypes[elementType].label + ' N';
    },
    newElement:function(params = {type:0}){
        return Object.assign(
            {},
            ElementStructure,
            {
                label:this.generateLabel(params.type)
            },
            params,
            {
                id:this.generateId() // the id last cause we do not want dupes
            }
        );
    }
};

export default ElementFactory;
