import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../../../../store';
import treeHelpers from '../../../../factories/Tree';
import {merge} from 'lodash';

import './styles.css';

export class DumbMenuItem extends Component {
    group(){
        // get the pick
        let pick = [].concat(this.props.pick.elements);
        let e0 = pick[0];
        // find out lowest and greatest x & y coordinates.
        let x0 = e0.left, x1 = e0.left + e0.width, y0 = e0.top, y1 = e0.top + e0.height;
        pick.splice(0,1);
        for (let element of pick) {
            let right = element.left+element.width;
            let bottom = element.top+element.height;

            if (element.left<x0) x0 = element.left;
            if (right>x1) x1 = right;
            if (element.top<y0) y0 = element.top;
            if (bottom>y1) y1 = bottom;
        }
        let groupDims = {
            left:x0,
            top:y0,
            width:x1-x0,
            height:y1-y0
        }
        let groupStyle = merge({},groupDims,{
            backgroundColor:'rgba(0,0,0,0)',
            borderStyle:'none'
        })


        let state = store.getState();
        // where are we storing the new elemwnt?
        let where = state.tree.children;
        // lets generate the element structure with the help of the tree functions
        let newElement = treeHelpers.generateElement(where,'Group',groupStyle);
        // we dupe the state not to interefere with the current one
        let newTree = merge({},state.tree);
        // lets nest the children within the group and correct their positions.
        for (let element of this.props.pick.elements){
            let fullElement = merge({},treeHelpers.getElementDataById(newTree.children,element.id));
            for (let state of fullElement.states){
                state.style.left = state.style.left - x0;
                state.style.top = state.style.top - y0;
            }
            newElement.children.push(fullElement);
            newTree = treeHelpers.removeElementById(newTree,element.id);
        }
        // we push the new element to the tree children.
        newTree.children.push(newElement);
        // lets set the grouped elements within the grouped layer
        // now we send the new tree to be re-rendered
        store.dispatch({
            type:'TREE_FULL',
            val:newTree
        });
        // and we fix the pick not to have the elements but the group
        store.dispatch({
            type:'PICK_CLEAR'
        });
        store.dispatch({
            type:'PICK_ADD',
            val:merge({},{
                id:newElement.id
            },groupDims)
        })
    }
    componentDidMount(){
        store.dispatch({
            type:"KEY_COMBO",
            val:{
                '71':{
                    keydown:(e)=>{
                        if(e.ctrlKey||e.metaKey){
                            this.group();
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
                <button ref="groupButton" className="menu__dropdown-item" onClick={this.group.bind(this)} disabled={(this.props.pick.elements.length<2)?'disabled':''}><span className="flex-loose">Group</span></button>
            </div>
        )
    }
}

const mapStateToProps = function(store) {
    return {
        pick:store.pick
    };
};

export const MenuItem = connect(mapStateToProps)(DumbMenuItem);
