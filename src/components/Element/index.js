import React, { Component } from 'react';
import store from '../../store';
import ObjectTools from '../../factories/ObjectTools';

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
        if(ObjectTools.objectAvailableByKey('id',this.props.specs.id,this.props.pick.elements)) {
            classArray.push('selected');
        }
        if(this.props.specs.id === "root") {
            classArray.push("element--root");
            if(this.props.pick.elements.length>1){
                classArray.push('selected-multiple');
            }
        }
        return classArray.join(' ');
    }
    renderTools(){
        if(this.props.specs.id !== "root") {
            return (
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
            );
        }
        return null;
    }
    storeDimensions(){
        if (this.refs.root!==undefined){
            let offset = function(el) {
                let rect = el.getBoundingClientRect();
                return { top: rect.top, left: rect.left }
            }
            let zeOffset = offset(this.refs.root);
            store.dispatch({
                type:'SCREEN_OFFSET',
                val:zeOffset
            });
        }
    }
    componentDidMount(){
        if (this.refs.root!==undefined){
            this.storeDimensions();
            window.addEventListener("resize",this.storeDimensions.bind(this));
        }
    }

    componentWillUnmount() {
        if (this.refs.root!==undefined){
            window.removeEventListener("resize", this.updateDimensions.bind(this));
        }
    }
    conponentWillUpdate(){
        console.log(this.props.specs.id);
    }
    render(){

        if (this.props.specs.states){
            let specs =  this.props.specs.states[this.props.specs.currentState];
            return (
                <div id={'els_'+this.props.specs.id} className={this.getClassString()} style={{...specs.style}} ref={this.props.specs.id}>
                    {this.renderTools()}
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
