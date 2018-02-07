import React, { Component } from 'react';
import { connect } from 'react-redux';
import PickHelpers from '../../factories/Pick';
import TreeHelpers from '../../factories/Tree';
import store from '../../store';
import {merge} from 'lodash';

import './styles.css';

class Tree extends Component {
    findTree(treeId,tree){
        if (tree.id===treeId) {
            return tree;
        } else {
            for (let child of tree.children){
                return this.findTree(treeId,child);
            }
        }
        return false;
    }
    selectItem(e){
        let element = e.target;
        let elementId = element.dataset.elementId;
        let addKey = e.ctrlKey || e.metaKey;
        //let swipeKey = e.shiftKey;

        let currentPick = store.getState().pick;
        let pick = merge(
            {},
            PickHelpers,
            {
                elements:currentPick.elements,
                initialStates:currentPick.initialStates
            }
        );

        // BOOM
        PickHelpers.addElementToPick(elementId, pick, addKey);
    }
    renderChildren(){
        let children = this.props.tree.children;
        let returnArray =[];
        let path = (this.props.path!==''?(this.props.path+'_'):'')+this.props.index;
        for (let i=children.length-1; i>-1; i--){
            returnArray.push(<Tree key={i} index={i} tree={children[i]} path={path}></Tree>);
        }
        return returnArray;
    }
    dragEnter(e){
        e.preventDefault();
    }
    drop(e,tgt){
        e.preventDefault();
        let target = e.target;
        let targetId = target.dataset.elementId;

        let state = store.getState();
        let tree = merge({},state.tree);
        let pick = state.pick.elements;
        let transferArray = [];
        for (let element of pick){
            let transfer = TreeHelpers.spliceElementById(tree,element.id);
            if (transfer) transferArray.push(transfer[0]);
        }
        console.log(tree,transferArray);
        tree = TreeHelpers.InsertElementsBefore(tree,targetId,transferArray);

        // concat the beginning for the insertion array, the transferarray and the end of the insertion array

        console.log(tree);


        store.dispatch({
            type:'TREE_FULL',
            val:tree
        });

        store.dispatch({
            type:'PUBLIC_REMOVE',
            key:'layerDrag'
        })
    }
    dragOver(e){
        e.preventDefault();
    }
    dragStart(e){
        // store.dispatch({
        //     type:'PUBLIC_ADD',
        //     key:'layerDrag',
        //     val:e.target
        // })
    }
    renderButton(){
        let tree = this.props.tree;
        if(tree.id !== 'root'){
            return <button className="tree-button" data-element-id={this.props.tree.id} data-path={this.props.path+'_'+this.props.index} onDragStart={this.dragStart} onDragOver={this.dragOver} onDrop={this.drop.bind(this)} draggable="true" onMouseDown={this.selectItem}>{tree.label}</button>
        } else {
            return <button className="tree-button" data-element-id={this.props.tree.id} onMouseDown={this.selectItem}>{tree.label}</button>
        }
    }
    render(){
        let tree = this.props.tree;
        return (
            <div className={"tree-element ch_"+tree.id}>

                {this.renderButton()}

                <style type="text/css">{'.'+tree.id+' .ch_'+tree.id+'{background-color:#ccc}'}</style>

                {this.renderChildren()}

            </div>
        );
    }
}

class LeftBar extends Component {
    render(){
        return (
            <div className={"leftbar "+this.props.pick.elements.map((element)  => {return element.id+" "}).join(" ")}>
                <Tree tree={this.props.tree} path={''} index={'root'}></Tree>
            </div>
        );
    }
}

const mapStateToProps = function(store) {
    return {
        tree:store.tree,
        pick:store.pick
    };
};

const SmartLeftBar = connect(mapStateToProps)(LeftBar);

export default SmartLeftBar;
