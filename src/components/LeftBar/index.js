import React, { Component } from 'react';
import { connect } from 'react-redux';
import PickHelpers from '../../factories/Pick';
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
    sortTree(el,target,source,sibling){
        let elId = el.dataset.elementId;
        let prevId = (sibling?sibling.dataset.elementId:null);
        let parentId = source.dataset.elementId;
        let elIndex = 0;
        let spliceIndex = 0;

        let nuTree = merge({},this.props.tree);
        let branch = this.findTree(parentId,nuTree);
        let looseElement;

        for (let child of branch.children){
            if (child.id===elId) {
                looseElement = branch.children.splice(elIndex,1);
            }
            elIndex++;
        }

        if (prevId) {
            for (let child of branch.children) {
                if (child.id === prevId) break;
                spliceIndex++
            }
        }
        branch.children.splice(spliceIndex,0,looseElement[0]);

        console.log(nuTree);

        // store.dispatch({
        //     type:'TREE_FULL',
        //     val:nuTree
        // });
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
    componentDidMount(){

    }
    componentWillUnmount(){

    }
    renderChildren(){
        let children = this.props.tree.children;
        let returnArray =[];
        for (let i=children.length-1; i>-1; i--){
            returnArray.push(<Tree key={i} index={i} tree={children[i]} path={this.props.path+'_'+this.props.index}></Tree>);
        }
        return returnArray;
    }
    render(){
        let tree = this.props.tree;
        return (
            <div className={"tree-element ch_"+tree.id}>

                <button className="tree-button" onClick={this.selectItem}>{tree.label} {this.props.path+'_'+this.props.index}</button>

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
