import React, { Component } from 'react';

import './styles.css';

class Element extends Component {
    renderChildren(){
        return this.props.specs.children.map(
            (child, i) => {
                return (<Element key={i} specs={child} pick={this.props.pick} />);
            }
        )
    }
    getClassString(){
        let classes = this.props.specs.states[this.props.specs.currentState].classes;
        let classArray = ['element'].concat(classes);
        if(this.props.pick.elements.indexOf(this.props.specs.id)>-1) {
            classArray.push('selected');
            if(this.props.pick.elements.length>1){
                classArray.push('selected-multiple');
            }
        }
        return classArray.join(' ');
    }
    render(){
        if (this.props.specs.states){
            let specs =  this.props.specs.states[this.props.specs.currentState];
            return (
                <div className={this.getClassString()} style={specs.style}>
                    <div className="element__tools">
                        <div data-id={this.props.specs.id} data-resize='nw' data-move='0' className="element__tool element__tool--top-left"></div>
                        <div data-id={this.props.specs.id} data-resize='n' data-move='0' className="element__tool element__tool--top"></div>
                        <div data-id={this.props.specs.id} data-resize='ne' data-move='0' className="element__tool element__tool--top-right"></div>
                        <div data-id={this.props.specs.id} data-resize='w' data-move='0' className="element__tool element__tool--left"></div>
                        <div data-id={this.props.specs.id} data-resize='' data-move='1' className="element__tool element__tool--center"></div>
                        <div data-id={this.props.specs.id} data-resize='e' data-move='0' className="element__tool element__tool--right"></div>
                        <div data-id={this.props.specs.id} data-resize='sw' data-move='0' className="element__tool element__tool--bottom-left"></div>
                        <div data-id={this.props.specs.id} data-resize='s' data-move='0' className="element__tool element__tool--bottom"></div>
                        <div data-id={this.props.specs.id} data-resize='se' data-move='0' className="element__tool element__tool--bottom-right"></div>
                    </div>
                    <div className="element__contents">
                        {specs.text}
                        {this.renderChildren()}
                    </div>
                </div>);
        } else {
            return null;
        }
    }
}

export default Element;
