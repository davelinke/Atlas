import React, { Component } from 'react';

import './Element.css';

class Element extends Component {
    constructor(props){
        super(props);
        this.currentState = this.props.specs.currentState;
        this.stateObject = this.props.specs.states[this.currentState];
        this.renderChildren = () => {
            return this.props.specs.children.map(
                (child, i) => {
                    return (<Element key={i} specs={child} />);
                }
            )
        };
    }
    render(){
        return (<div style={this.stateObject.style}>{this.stateObject.text}{this.renderChildren()}</div>);
    }
}

export default Element;
