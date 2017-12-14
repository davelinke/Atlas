import React, { Component } from 'react';
import { connect } from 'react-redux';
import TreeHelpers from '../../factories/Tree';
import store from '../../store';
import InputNumeric from '../Inputs/InputNumeric/';
import InputColor from '../Inputs/InputColor/';
import './styles.css';

class ElementsSidebar extends Component {
    elementValues(){
        // let's get the pick
        let pick = this.props.pick.elements;

        // let's handle the pick
        if (pick.length===0){
            // nothings selected, thus we present the arboard props
            let elementData = this.props.tree;
            let elementState = elementData.currentState;
            let stateStyle = elementData.states[elementState].style;
            return stateStyle;

        } else if (pick.length===1){
            // just one element, have fun
            // lets get that element's props
            let pickElement = pick[0];
            let elementId = pickElement.id;
            let elementData = TreeHelpers.getElementDataById(this.props.tree.children,elementId);
            let elementState = elementData.currentState;
            let stateStyle = elementData.states[elementState].style;
            return stateStyle;
        } else {
            // multiple elements! superfun!

        }
    }
    shouldComponentUpdate(){
        //return (this.props.pick.elements.length>0?true:false);
        return this.props.tools.current === 'selection';
    }
    getValue(style,prop){
        if (style && style[prop]){
            return style[prop];
        }
        return '';
    }
    updateValue(e,altValue = false){
        // let's get the pick
        let dataType = function(data,type){
            switch(type){
                case ('number'):
                    return parseInt(data,10);
                default:
                    return data;
            }
        };
        let pick = this.props.pick.elements;
        let nuTree = Object.assign({},this.props.tree);
        let zeInput = e.target;
        let which = zeInput.dataset.which;
        let zeValue = (altValue?altValue:dataType(zeInput.value,zeInput.dataset.type));
        // let's handle the pick
        if (pick.length===0){
            // nothings selected, thus we present the arboard props

            let elementData = nuTree;
            let elementState = elementData.currentState;
            let stateStyle = elementData.states[elementState].style;
            stateStyle[which] = zeValue;

        } else if (pick.length===1){
            // just one element, have fun
            // lets get that element's props
            let pickElement = pick[0];
            let elementId = pickElement.id;

            let elementData = TreeHelpers.getElementDataById(nuTree.children,elementId);
            let elementState = elementData.currentState;
            let stateStyle = elementData.states[elementState].style;
            stateStyle[which] = zeValue;
        } else {
            // multiple elements! superfun!

        }
        store.dispatch({
            type:'TREE_FULL',
            val:nuTree
        });
    }
    rotateFunc(str = 'rotate(0deg)'){
        return parseInt(str.split('(')[1].split('deg')[0],10);
    };
    rotateChange(e){
        e.persist()
        this.updateValue(e,'rotate(Xdeg)'.replace('X',e.target.value));
    }
    render(){
        let elementValues = this.elementValues();
        let pickLength = this.props.pick.elements.length;
        let recompose = (str = 'rotate(0deg)',val)=>{
            return str.replace('0',val);
        };
        return (
            <div className="element-sidebar">
                <div className="element-sidebar__group">
                    <h3>Dimensions</h3>
                    <div className="flex-row">
                        <div className="flex-loose">
                            <div className="flex-row">
                                <label className="flex-static">X</label>
                                <InputNumeric disabled={pickLength<1?"disabled":""} which="left" value={this.getValue(elementValues,'left')} change={this.updateValue.bind(this)} />
                            </div>
                            <div className="flex-row">
                                <label className="flex-static">Y</label>
                                <InputNumeric disabled={pickLength<1?"disabled":""} which="top" value={this.getValue(elementValues,'top')} change={this.updateValue.bind(this)} />
                            </div>
                        </div>
                        <div className="flex-loose">
                            <div className="flex-row">
                                <label title="Width" className="flex-static">W</label>
                                <InputNumeric which="width" value={this.getValue(elementValues,'width')} change={this.updateValue.bind(this)} />
                            </div>
                            <div className="flex-row">
                                <label title="Height" className="flex-static">H</label>
                                <InputNumeric which="height" value={this.getValue(elementValues,'height')} change={this.updateValue.bind(this)} />
                            </div>
                        </div>
                        <div className="flex-loose">
                            <div className="flex-row">
                                <label title="Rotation" className="flex-static"><i className="material-icons">rotate_left</i></label>
                                <InputNumeric which="transform" disabled={pickLength<1?"disabled":""} value={this.rotateFunc(this.getValue(elementValues,'transform'))} change={this.rotateChange.bind(this)} />
                            </div>
                            <div className="flex-row">
                                <label title="Border Radius" className="flex-static"><i className="material-icons">rounded_corner</i></label>
                                <InputNumeric which="borderRadius" disabled={pickLength<1?"disabled":""} value={this.getValue(elementValues,'borderRadius')} change={this.updateValue.bind(this)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cols-3">
                    <div className="element-sidebar__group">
                        <h3>Color</h3>
                        <div className="flex-row">
                            <div className="flex-loose">
                                <div className="flex-row">
                                    <label title="Fill Style"><i className='material-icons'>format_color_fill</i></label>
                                    <InputColor which="backgroundColor" value={this.getValue(elementValues,'backgroundColor')} change={this.updateValue.bind(this)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="element-sidebar__group">
                        <h3>Border</h3>
                        <div className="flex-row">
                            <div className="flex-loose">
                                <div className="flex-row">
                                    <label title="Border Style"><i className='material-icons'>border_style</i></label>
                                    <InputColor disabled={pickLength<1?"disabled":""} which="borderColor" value={this.getValue(elementValues,'borderColor')} change={this.updateValue.bind(this)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(store) {
    return {
        pick:store.pick,
        tree:store.tree,
        tools:store.tools
    };
};
const SmartElementsSidebar = connect(mapStateToProps)(ElementsSidebar);


export default SmartElementsSidebar;
