import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../../../../store';

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
            let nuData = Object.assign({},this.props.menu.helperData.menuFileNew);
            nuData.width=e.target.value;
            store.dispatch({
                type:'MENU_ADD_HELPER',
                key:'menuFileNew',
                value:nuData
            })
        }.bind(this);
        this.setHeight = function(e){
            let nuData = Object.assign({},this.props.menu.helperData.menuFileNew);
            nuData.height=e.target.value;
            store.dispatch({
                type:'MENU_ADD_HELPER',
                key:'menuFileNew',
                value:nuData
            })
        }.bind(this);
        this.createNewFile = function(){
            let size = this.props.menu.helperData.menuFileNew;
            store.dispatch({
                type:'TREE_FULL',
                val:{
                    id:"root",
                    label:"Artboard 1",
                    children:[],
                    currentState:0,
                    states:[
                        {
                    		label:"base",
                            classes:[],
                            text:"hello",
                            style:{
                            	position:"relative",
                                width:size.width,
                                height:size.height,
                                backgroundColor:"#fff",
                                color:"#000"
                            }
                    	}
                    ]
                }
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
    render(){
        let selfData = this.props.menu.helperData.menuFileNew?this.props.menu.helperData.menuFileNew:this.defaultData;
        let visible = this.props.menu.helperData.menuFileNewVisible;
        return(
            <div className={visible?'nfo visible':'nfo'}>
                <div className="nfo__backdrop"></div>
                <div className="nfo__layer">
                    <div>width<input type="number" onChange={this.setWidth} value={selfData.width} />px</div>
                    <div>height<input type="number" onChange={this.setHeight} value={selfData.height}/>px</div>
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
