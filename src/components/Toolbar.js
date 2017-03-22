import React, { Component } from 'react';
import { connect } from 'react-redux';
import ToolbarButton from './ToolbarButton';
//import store from '../store';

import './Toolbar.css';



class Toolbar extends Component {
    constructor(props){
        super(props);
        this.renderTools = function(){
            console.log(this.props.tools.set);
            let toolArray = [];
            let tools = this.props.tools.set;
            for (let tool in tools){
                if (tools.hasOwnProperty(tool)) {
                    toolArray.push(<ToolbarButton key={tool} tool={tools[tool]} />);
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
