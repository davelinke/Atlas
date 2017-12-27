import React, { Component } from 'react';
import { connect } from 'react-redux';
//import store from '../../store';
import './styles.css';

class LeftBar extends Component {
    renderLayers(children){
        return <ul className="tree">{children.map((child)=>{return <li className="tree-item" key={child.id}><button className="tree-item-button">{child.label}</button>{child.children.lenght>0?this.renderLayers(child.children):null}</li>})}</ul>
    }
    renderTree(tree){
        return (
            <ul className="tree">
                <li className="tree-item">
                    <button className="tree-item-button">{tree.label}</button>
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
