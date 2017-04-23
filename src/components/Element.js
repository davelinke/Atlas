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
                    return (<Element key={i} specs={child} pick={this.props.pick} />);
                }
            )
        };
        this.getClassString = () => {
            let classArray = [].concat(this.stateObject.classes);
            if(this.props.pick.elements.indexOf(this.props.specs.id)>-1) {
                classArray.push('selected');
            }
            return classArray.join(' ');
        };
    }
    render(){
        console.log('element rendering');
        return (<div data-element-id={this.props.specs.id} className={this.getClassString()} style={this.stateObject.style}>{this.stateObject.text}{this.renderChildren()}</div>);
    }
}

export default Element;
