import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../../../../store';
import treeHelpers from '../../../../factories/Tree';
import {merge} from 'lodash';

import './styles.css';

export class DumbMenuItem extends Component {
    ungroup(){
        // get the pick
        let pick = [].concat(this.props.pick.elements);
        let nuPick = [].concat(this.props.pick.elements);
        let nuTree = merge({},this.props.tree);
        for (let element of pick) {
            let elementData = merge({},treeHelpers.getElementDataById(nuTree.children, element.id));
            if(elementData.children.length>0){
                // recalculate children coordinates by adding mine to children (in all states)
                // get the index of the group and insert right after
                let groupIndex = treeHelpers.getElementIndex(nuTree.children, element.id);

                for (let child of elementData.children){
                    for (let state of child.states){
                        state.style.left = state.style.left + element.left;
                        state.style.top = state.style.top + element.top;
                    }
                    // get them children and place them at my level
                    nuTree.children.splice(groupIndex,0,child);
                    let childState = child.states[child.currentState];
                    nuPick.push({
                        id:child.id,
                        top:childState.style.top,
                        left:childState.style.left,
                        width:childState.style.width,
                        height:childState.style.height
                    });
                }
                // get rid of group div
                nuTree = treeHelpers.removeElementById(nuTree,element.id);
                // remove group div from pick
                nuPick = nuPick.filter((po)=>{
                    let returnValue = (po.id!==element.id);
                    return returnValue;
                });
            }
        }
        // dispatch everything
        store.dispatch({
            type:'PICK_CLEAR'
        })
        store.dispatch({
            type:'TREE_FULL',
            val:nuTree
        });
        store.dispatch({
            type:'PICK_FULL',
            val:nuPick
        });
        // be happy
    }
    componentDidMount(){
        store.dispatch({
            type:"KEY_COMBO",
            val:{
                '85':{
                    keydown:(e)=>{
                        if(e.ctrlKey||e.metaKey){
                            this.ungroup();
                        }
                    },
                    keyup:(e)=>{}
                }
            }
        })
    }
    render(){
        return (
            <div>
                <button className="menu__dropdown-item" onClick={this.ungroup.bind(this)} disabled={(this.props.pick.elements.length<2)?'disabled':''}><span className="flex-loose">Ungroup</span></button>
            </div>
        )
    }
}

const mapStateToProps = function(store) {
    return {
        pick:store.pick,
        tree:store.tree
    };
};

export const MenuItem = connect(mapStateToProps)(DumbMenuItem);
