import React, { Component } from 'react';
import { connect } from 'react-redux';
import PickHelpers from '../../factories/Pick';
import store from '../../store';
import {merge} from 'lodash';

import './styles.css';

class LeftBar extends Component {
    selectItem(e){
        let element = e.target;
        let elementId = element.dataset.elementId;
        let addKey = e.ctrlKey || e.metaKey;
        //let swipeKey = e.shiftKey;
        console.log(elementId);

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
    renderLayers(children){
        return <ul className="tree">{children.map((child)=>{return <li className="tree-item" key={child.id}><button className="tree-item-button" data-element-id={child.id} onClick={this.selectItem}>{child.label}</button>{child.children.lenght>0?this.renderLayers(child.children):null}</li>})}</ul>
    }
    renderTree(tree){
        return (
            <ul className="tree">
                <li className="tree-item">
                    <button className="tree-item-button" data-element-id="root" onClick={this.selectItem}>{tree.label}</button>
                    {this.renderLayers(tree.children)}
                </li>
            </ul>
        );
    }
    render(){
        return (
            <div className={"leftbar "}>
                {this.renderTree(this.props.tree)}
            </div>
        );
    }
}

const mapStateToProps = function(store) {
    return {
        tree:store.tree
    };
};

const SmartLeftBar = connect(mapStateToProps)(LeftBar);

export default SmartLeftBar;
