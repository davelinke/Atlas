import React, { Component } from 'react';
import { connect } from 'react-redux';
import {merge} from 'lodash';
import store from '../../../../store';
import layouts from './PredefinedLayouts';
import structures from '../../../../structures/Element';

import './styles.css';

export class MenuItem extends Component{
    newFile(){
        store.dispatch({
            type:'MENU_ADD_HELPER',
            key:'menuFileNewVisible',
            value:true
        });
    }
    render(){
        return (
            <div>
                <button className="menu__dropdown-item" onClick={this.newFile}>New</button>
            </div>
        )
    }
}

export class DumbMenuHelper extends Component{
    constructor(props){
		super(props);
        this.defaultData= {
            width:240,
            height:360
        };
        this.setWidth = function(e){
            let nuData = merge({},this.props.menu.helperData.menuFileNew);
            nuData.width=e.target.value;
            store.dispatch({
                type:'MENU_ADD_HELPER',
                key:'menuFileNew',
                value:nuData
            })
        }.bind(this);
        this.setHeight = function(e){
            let nuData = merge({},this.props.menu.helperData.menuFileNew);
            nuData.height=e.target.value;
            store.dispatch({
                type:'MENU_ADD_HELPER',
                key:'menuFileNew',
                value:nuData
            })
        }.bind(this);
        this.setLayout = function(e){
            let nuData = merge({},this.props.menu.helperData.menuFileNew);
            let wha = e.target.value.split('x');
            nuData.width=parseInt(wha[0],10);
            nuData.height=parseInt(wha[1],10);
            store.dispatch({
                type:'MENU_ADD_HELPER',
                key:'menuFileNew',
                value:nuData
            })
        }.bind(this);
        this.createNewFile = function(){
            let size = this.props.menu.helperData.menuFileNew;
            let nuTree = merge({},structures.artboard);
            nuTree.states[0].style.width = size.width;
            nuTree.states[0].style.height = size.height;
            store.dispatch({
                type:'TREE_FULL',
                val:nuTree
            });
            store.dispatch({
                type:'MENU_ADD_HELPER',
                key:'menuFileNewVisible',
                value:false
            });
        }.bind(this);
    }
    componentWillMount(){
        store.dispatch({
            type:'MENU_ADD_HELPER',
            key:'menuFileNew',
            value:this.defaultData
        });
        store.dispatch({
            type:'MENU_ADD_HELPER',
            key:'menuFileNewVisible',
            value:false
        });
    }
    cancel(){
        store.dispatch({
            type:'MENU_ADD_HELPER',
            key:'menuFileNewVisible',
            value:false
        })
    }
    renderLayouts(){
        let renderSizes = function(los){
            return los.map((lo,j)=>{
                return <option key={j} value={lo.width+'x'+lo.height}>{lo.name} - ({lo.width}x{lo.height}){lo.unit}</option>
            });
        }
        return layouts.map((type, i)=>{
            return <optgroup key={i} label={type.name}>{renderSizes(type.layouts)}</optgroup>
        });
    }
    render(){
        let selfData = this.props.menu.helperData.menuFileNew?this.props.menu.helperData.menuFileNew:this.defaultData;
        let visible = this.props.menu.helperData.menuFileNewVisible;
        return(
            <div className={visible?'nfo visible':'nfo'}>
                <div className="nfo__backdrop"></div>
                <div className="nfo__layer">
                    <div>
                        <label>Predefined Layout</label>
                        <select onChange={this.setLayout}>
                            {this.renderLayouts()}
                        </select>
                    </div>
                    <div>
                        <label>Width</label>
                        <input type="number" onChange={this.setWidth} value={selfData.width} />px
                    </div>
                    <div>
                        <label>Height</label>
                        <input type="number" onChange={this.setHeight} value={selfData.height}/>px
                    </div>
                    <div><button onClick={this.cancel}>Cancel</button> <button onClick={this.createNewFile}>Go</button></div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = function(store) {
    return {
        menu:store.menu
    };
};

export const MenuHelper = connect(mapStateToProps)(DumbMenuHelper);
