import React, { Component } from 'react';
import { connect } from 'react-redux';
import ToolbarButton from '../ToolbarButton/ToolbarButton';
import store from '../../store';

import './Toolbar.css';



class Toolbar extends Component {
    constructor(props){
        super(props);
        this.activateTool = function(theTool){
            console.log('activating tool ' + theTool)
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
        console.log('rendering tools')
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
