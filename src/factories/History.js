import DeepDiff from 'deep-diff';

export default {
    checkTreeChange:function(stateObject){
        return DeepDiff.diff(stateObject.tree, stateObject.history.prev.tree);
    },
    undoLog:function(state){

    }
}
