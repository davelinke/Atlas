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
        e.target.classList.add('hover');
    }
    dragLeave(e){
        e.preventDefault();
        e.target.classList.remove('hover');
    }
    drop(e, before=true){
        // VERIFY WHY WHEN DROPPING ON PARENT GROUPS LAYER GOES TO HELL

        e.preventDefault();
        let target = e.target;
        let targetId = target.dataset.elementId;

        if (!PickHelpers.isInPick(targetId)){
            let state = store.getState();
            let tree = merge({},state.tree);
            let targetElementParent = TreeHelpers.getParentElement(tree,targetId);
            let pick = state.pick.elements;
            let transferArray = [];
            for (let element of pick){
                let elementSource = TreeHelpers.getParentElement(tree,element.id);
                if(targetElementParent!==elementSource){
                    console.log('isdifferent');
                    // is different, thus recalculate the top-left
                    // find the delta by comparing coords to root
                    
                }
                let transfer = TreeHelpers.spliceElementById(tree,element.id);
                if (transfer) transferArray.push(transfer[0]);
            }

            // recalculate coords when transfering
            // check the position of parents and opearte accordingly

            tree = TreeHelpers[(before?'InsertElementsBefore':'InsertElementsAfter')](tree,targetId,transferArray);

            store.dispatch({
                type:'TREE_FULL',
                val:tree
            });
            store.dispatch({
                type:'PUBLIC_ADD',
                key:'layerDrag',
                val:false
            })
        }
    }
    dropBefore(e){
        this.drop(e,true);
    }
    dropAfter(e){
        this.drop(e,false);
    }
    dragOver(e){
        e.preventDefault();
    }
    dragStart(e){
        store.dispatch({
            type:'PUBLIC_ADD',
            key:'layerDrag',
            val:true
        })
    }
    componentWillMount(){
        store.dispatch({
            type:'PUBLIC_ADD',
            key:'layerDrag',
            val:false
        })
    }
    componentWillUnmount(){
        store.dispatch({
            type:'PUBLIC_REMOVE',
            key:'layerDrag'
        })
    }
    renderButton(){
        let tree = this.props.tree;
        if(tree.id !== 'root'){
            return (
                <button className="tree-button" data-element-id={this.props.tree.id} onDragStart={this.dragStart} draggable="true" onMouseDown={this.selectItem}>
                    <span className="drop-zone" data-element-id={this.props.tree.id} onDragOver={this.dragOver} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave}  onDrop={this.dropBefore.bind(this)}></span>
                    {tree.label}
                    <span className="drop-zone" data-element-id={this.props.tree.id} onDragOver={this.dragOver} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave} onDrop={this.dropAfter.bind(this)}></span>
                </button>
            );
        } else {
            return <button className="tree-button" data-element-id={this.props.tree.id} onMouseDown={this.selectItem}>{tree.label}</button>
        }
    }
    render(){
        let tree = this.props.tree;
        return (
            <div className={"tree-element ch_"+tree.id}>

                {this.renderButton()}

                <style type="text/css">{'.'+tree.id+' .ch_'+tree.id+'{background-color:#ccc} .'+tree.id+' .ch_'+tree.id+' .drop-zone{opacity:0 !important;pointer-events:none !important;}'}</style>

                {this.renderChildren()}

            </div>
        );
    }
}

class LeftBar extends Component {
    render(){
        return (
            <div className={"leftbar "+(this.props.public.layerDrag?'drag':'')+" "+this.props.pick.elements.map((element)  => {return element.id+" "}).join(" ")}>
                <Tree tree={this.props.tree} path={''} index={'root'}></Tree>
            </div>
        );
    }
}

const mapStateToProps = function(store) {
    return {
        tree:store.tree,
        pick:store.pick,
        public:store.public
    };
};

const SmartLeftBar = connect(mapStateToProps)(LeftBar);

export default SmartLeftBar;
