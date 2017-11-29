import React, { Component } from 'react';

import './ToolbarButton.css';

class ToolbarButton extends Component {
    constructor(props){
        super(props);
        this.toolName = this.props.toolName;
        this.tool = this.props.tool;
        this.toolIcon = this.tool.iconClass
        this.renderIcon = function(){
            if (this.toolIcon) return <span className={this.toolIcon}></span>;
        };
        this.activateTool = function(){
            this.props.activateTool(this.toolName);
        }.bind(this);
        this.theClass = function(){
            return (this.props.toolName===this.props.currentTool?'toolbar-button active':'toolbar-button')
        }.bind(this);
    }
    render(){
        return (<button className={this.theClass()} onClick={this.activateTool}>{this.renderIcon()}<span className="sr-only">{this.toolName}</span></button>);
    }
}

export default ToolbarButton;
