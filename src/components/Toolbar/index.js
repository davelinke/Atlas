import React, { Component } from 'react';
import { connect } from 'react-redux';
import ToolbarButton from '../ToolbarButton/';
import store from '../../store';

import './styles.css';



class Toolbar extends Component {
    constructor(props){
        super(props);
        this.activateTool = function(theTool){
            store.dispatch({
				type:'TOOLS_CURRENT',
				val:theTool
			});
        };
        this.renderTools = function(){
            let toolArray = [];
            let tools = this.props.tools.set;
            for (let tool in tools){
                if (tools.hasOwnProperty(tool)) {
                    toolArray.push(<ToolbarButton key={tool} toolName={tool} tool={tools[tool]} activateTool={this.activateTool} currentTool={this.props.tools.current} />);
                }
            }
            return toolArray;
        }.bind(this);
    }
    render(){
        return (<div className="toolbar">{this.renderTools()}</div>);
    }
}


const mapStateToProps = function(store) {
  return {
    tools:store.tools
  };
};
const SmartToolbar = connect(mapStateToProps)(Toolbar);


export default SmartToolbar;
