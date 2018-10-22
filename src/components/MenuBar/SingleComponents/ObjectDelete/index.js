import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../../../../store';
import treeHelpers from '../../../../factories/Tree';
import {merge} from 'lodash';

import './styles.css';

export class DumbMenuItem extends Component {
    delete(){
        let pick = [].concat(this.props.pick.elements);
        let nuTree = merge({},this.props.tree);
        for (let element of pick) {
            // get rid of the element
            nuTree = treeHelpers.removeElementById(nuTree,element.id);
        }
        // dispatch everything
        store.dispatch({
            type:'PICK_CLEAR'
        })
        store.dispatch({
            type:'TREE_FULL',
            val:nuTree
        });
    }
    componentDidMount(){
        store.dispatch({
            type:"KEY_COMBO",
            val:{
                '46':{
                    keydown:(e)=>{
                        this.delete();
                    },
                    keyup:(e)=>{}
                }
            }
        })
    }
    render(){
        return (
            <div>
                <button ref="deleteButton" className="menu__dropdown-item" onClick={this.delete.bind(this)} disabled={(this.props.pick.elements.length<1)?'disabled':''}><span className="flex-loose">Delete</span></button>
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
