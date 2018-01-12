import React, { Component } from 'react';
import { connect } from 'react-redux';
import ToolbarButton from '../ToolbarButton/';
import store from '../../store';

import './styles.css';



class Toolbar extends Component {
    constructor(props){
        super(props);
        this.activateTool = (theTool)=>{
            if (this.props.tools.current!==theTool){
                store.dispatch({
    				type:'TOOLS_CURRENT',
    				val:theTool
    			});
                store.dispatch({
    				type:'WORKAREA_CURSOR',
    				val:this.props.tools.set[theTool].cursor
    			});
                store.dispatch({
                    type:'PICK_CLEAR'
                });
            }
        };
        this.renderTools = ()=>{
            let toolArray = [];
            let tools = this.props.tools.set;
            for (let tool in tools){
                if (tools.hasOwnProperty(tool)) {
                    toolArray.push(<ToolbarButton key={tool} toolName={tool} tool={tools[tool]} activateTool={this.activateTool} currentTool={this.props.tools.current} />);
                }
            }
            return toolArray;
        };
    }
    render(){
        return (<div className="toolbar">{this.renderTools()}</div>);
    }
}


const mapStateToProps = function(store) {
  return {
    tools:store.tools,
    keyboard:store.keyboard
  };
};
const SmartToolbar = connect(mapStateToProps)(Toolbar);


export default SmartToolbar;
