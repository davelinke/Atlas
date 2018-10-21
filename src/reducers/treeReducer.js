import { Artboard } from '../structures/Element';
import { merge } from 'lodash';
// create the default state of the model
// const defaultState = merge({},Artboard);

const defaultState = merge({},JSON.parse('{"id":"root","label":"Artboard 1","children":[{"id":"DzTrG_1540139161685","label":"Group 1","currentState":0,"states":[{"id":"zVtJf_1540139161685","name":"base","classes":[],"style":{"position":"absolute","width":90,"height":110,"backgroundColor":"rgba(0,0,0,0)","borderColor":"#000000","borderStyle":"none","borderWidth":1,"borderRadius":0,"boxSizing":"border-box","transform":"rotate(0deg)","opacity":1,"mixBlendMode":"normal","left":140,"top":200},"actions":[],"text":""}],"locked":false,"type":"group","children":[{"id":"fXJVE_1540139158347","label":"Box 4","currentState":0,"states":[{"id":"iKFcZ_1540139158347","name":"base","classes":[],"style":{"position":"absolute","width":50,"height":40,"backgroundColor":"#ffffff","borderColor":"#000000","borderStyle":"solid","borderWidth":1,"borderRadius":0,"boxSizing":"border-box","transform":"rotate(0deg)","opacity":1,"mixBlendMode":"normal","top":70,"left":40},"actions":[],"text":""}],"locked":false,"type":"box","children":[]},{"id":"wSrcw_1540139157642","label":"Box 3","currentState":0,"states":[{"id":"CJhcg_1540139157642","name":"base","classes":[],"style":{"position":"absolute","width":40,"height":40,"backgroundColor":"#ffffff","borderColor":"#000000","borderStyle":"solid","borderWidth":1,"borderRadius":0,"boxSizing":"border-box","transform":"rotate(0deg)","opacity":1,"mixBlendMode":"normal","top":0,"left":0},"actions":[],"text":""}],"locked":false,"type":"box","children":[]}]},{"id":"PJgFV_1540139163193","label":"Group 2","currentState":0,"states":[{"id":"BiBso_1540139163193","name":"base","classes":[],"style":{"position":"absolute","width":110,"height":140,"backgroundColor":"rgba(0,0,0,0)","borderColor":"#000000","borderStyle":"none","borderWidth":1,"borderRadius":0,"boxSizing":"border-box","transform":"rotate(0deg)","opacity":1,"mixBlendMode":"normal","left":20,"top":10},"actions":[],"text":""}],"locked":false,"type":"group","children":[{"id":"UKuRW_1540139156386","label":"Box 1","currentState":0,"states":[{"id":"lcajO_1540139156386","name":"base","classes":[],"style":{"position":"absolute","width":70,"height":60,"backgroundColor":"#ffffff","borderColor":"#000000","borderStyle":"solid","borderWidth":1,"borderRadius":0,"boxSizing":"border-box","transform":"rotate(0deg)","opacity":1,"mixBlendMode":"normal","top":0,"left":0},"actions":[],"text":""}],"locked":false,"type":"box","children":[]},{"id":"KPpIu_1540139156980","label":"Box 2","currentState":0,"states":[{"id":"EBvCo_1540139156980","name":"base","classes":[],"style":{"position":"absolute","width":40,"height":50,"backgroundColor":"#ffffff","borderColor":"#000000","borderStyle":"solid","borderWidth":1,"borderRadius":0,"boxSizing":"border-box","transform":"rotate(0deg)","opacity":1,"mixBlendMode":"normal","top":90,"left":70},"actions":[],"text":""}],"locked":false,"type":"box","children":[]}]}],"currentState":0,"type":"artboard","states":[{"label":"base","classes":[],"text":"","style":{"position":"relative","width":240,"height":320,"backgroundColor":"#ffffff","color":"#000000","transform":"rotate(0deg)","opacity":1,"mixBlendMode":"normal"}}]}'))

const treeReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'TREE_ELEMENTS':
        return merge({},state.tree);
    case 'TREE_FULL':
        //console.log(JSON.stringify(action.val));
        return merge({},action.val);
    default:
        return state;
  }
};

export default treeReducer;


