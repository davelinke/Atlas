import React, { Component } from 'react';
import { connect } from 'react-redux';
import {merge} from 'lodash';
import TreeHelpers from '../../factories/Tree';
import store from '../../store';
import InputNumeric from '../Inputs/InputNumeric/';
import InputColor from '../Inputs/InputColor/';
import InputRange from '../Inputs/InputRange/';
import InputSelect from '../Inputs/InputSelect/';
import CssNavigator from '../CssNavigator/';
import FilterComposer from '../FilterComposer/';

class ElementsSidebarProperties extends Component {
    constructor(props){
        super(props);
        this.state = {
            filtersCollapsed:true
        }
    }
    elementValues(){
        // let's get the pick
        let pick = this.props.pick.elements;


        // let's handle the pick
        if (pick.length===0){
            // nothings selected, thus we present the arboard props
            let elementData = this.props.tree;
            let elementState = elementData.currentState;
            let stateStyle = elementData.states[elementState].style;
            return [stateStyle];

        } else {
            // just one element, have fun
            // lets get that element's props
            let output = [];
            for (let pickElement of pick){
                let elementId = pickElement.id;
                let elementData = TreeHelpers.getElementDataById(this.props.tree.children,elementId);
                let elementState = elementData.currentState;
                let stateStyle = elementData.states[elementState].style;

                output.push(stateStyle);

            }

            return output;
        }
    }
    elementTypes(){
        // let's get the pick
        let pick = this.props.pick.elements;
        // let's handle the pick
        if (pick.length===0){
            return this.props.tree.type;
        } else {
            let outputType = null;
            for (let pickElement of pick){
                let elementData = TreeHelpers.getElementDataById(this.props.tree.children,pickElement.id);
                if (!outputType){
                    outputType = elementData.type;
                } else {
                    if (outputType!==elementData.type){
                        return 'mixed';
                    }
                }
            }
            return outputType;
        }
    }
    shouldComponentUpdate(){
        //return (this.props.pick.elements.length>0?true:false);
        return this.props.tools.current === 'selection';
    }
    getValue(styles,prop){
        if (styles.length < 2) {
            let style = styles[0];
            if (style && (style[prop]!==undefined)){
                return style[prop];
            }
        } else {
            let baseStyle;
            let style = styles[0];
            if (style && (style[prop]!==undefined)){
                baseStyle = style[prop];
            }
            // multiple elements! superfun!
            // default behavior is that for elements that have the same values at the same properties
            // we show the value, otherwise we show blank!
            for (let i=1;i<styles.length;i++){
                style = styles[i];
                if (style && (style[prop]!==undefined) && (style[prop]===baseStyle)){
                    // life's good,  let's move forward
                } else {
                    return '';
                }
            }
            return baseStyle;
        }
        return '';
    }
    updateValue(e,altValue = false){
        // let's get the pick
        let dataType = function(data,type){
            switch(type){
                case ('number'):
                    return parseFloat(data);
                default:
                    return data;
            }
        };
        let pick = this.props.pick.elements;
        let nuTree = merge({},this.props.tree);
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

        } else {
            // just one element, have fun
            // lets get that element's props
            for (let pickElement of pick){
                let elementId = pickElement.id;

                let elementData = TreeHelpers.getElementDataById(nuTree.children,elementId);
                let elementState = elementData.currentState;
                let stateStyle = elementData.states[elementState].style;

                stateStyle[which] = zeValue;
            }
        }
        store.dispatch({
            type:'TREE_FULL',
            val:nuTree
        });
    }
    deleteProp(e){
        let pick = this.props.pick.elements;
        let nuTree = merge({},this.props.tree);
        let zeInput = e.target;
        let which = zeInput.dataset.which;

        if (pick.length>0){
            // just one element, have fun
            // lets get that element's props
            let pickElement = pick[0];
            let elementId = pickElement.id;

            let elementData = TreeHelpers.getElementDataById(nuTree.children,elementId);
            let elementState = elementData.currentState;
            let stateStyle = elementData.states[elementState].style;
            delete stateStyle[which];
        }
        store.dispatch({
            type:'TREE_FULL',
            val:nuTree
        });
    }
    addProp(args){
        let pick = this.props.pick.elements;
        let nuTree = merge({},this.props.tree);
        let elementData;

        if (pick.length>0){
            // just one element, have fun
            // lets get that element's props
            let pickElement = pick[0];
            let elementId = pickElement.id;

            elementData = TreeHelpers.getElementDataById(nuTree.children,elementId);
        } else if (pick.length===0){
            elementData = nuTree;
        }
        let elementState = elementData.currentState;
        let stateStyle = elementData.states[elementState].style;
        stateStyle[args.propName] = args.propValue;
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
        let elementTypes = this.elementTypes();
        let pickLength = this.props.pick.elements.length;
        return (
            <div className="sidebar__sub sidebar__properties">
                <div className="sidebar-easy">
                    <div className="sidebar__group">
                        <h3>Dimensions</h3>
                        <div className="sidebar__grid">
                            <label>X</label>
                            <InputNumeric disabled={pickLength<1?"disabled":""} which="left" value={this.getValue(elementValues,'left')} change={this.updateValue.bind(this)} />
                            <label title="Width">W</label>
                            <InputNumeric min={0} which="width" value={this.getValue(elementValues,'width')} change={this.updateValue.bind(this)} />
                            <label title="Rotation" className="flex-static"><i className="material-icons">rotate_left</i></label>
                            <InputNumeric which="transform" disabled={pickLength<1?"disabled":""} value={this.rotateFunc(this.getValue(elementValues,'transform'))} change={this.rotateChange.bind(this)} />
                            <label>Y</label>
                            <InputNumeric disabled={pickLength<1?"disabled":""} which="top" value={this.getValue(elementValues,'top')} change={this.updateValue.bind(this)} />
                            <label title="Height">H</label>
                            <InputNumeric min={0} which="height" value={this.getValue(elementValues,'height')} change={this.updateValue.bind(this)} />
                            <label title="Border Radius" className="flex-static"><i className="material-icons">rounded_corner</i></label>
                            <InputNumeric min={0} which="borderRadius" disabled={pickLength<1?"disabled":""} value={this.getValue(elementValues,'borderRadius')} change={this.updateValue.bind(this)} />
                        </div>
                    </div>
                    <div className="sidebar__group">
                        <h3>Blending</h3>
                        <div className="sidebar__grid">
                            <label title="Opacity"><i className="material-icons">opacity</i></label>
                            <InputRange className="span-4" disabled={pickLength<1?"disabled":""} min={0} max={1} step={0.01} which="opacity" value={this.getValue(elementValues,'opacity')} change={this.updateValue.bind(this)} />
                            <InputNumeric disabled={pickLength<1?"disabled":""} min={0} max={1} step={0.01} which="opacity" value={this.getValue(elementValues,'opacity')} change={this.updateValue.bind(this)} />
                            <label title="Blend Mode"><i className="material-icons">filter</i></label>
                            <InputSelect className="span-5" disabled={pickLength<1?"disabled":""} which="mixBlendMode" value={this.getValue(elementValues,'mixBlendMode')} change={this.updateValue.bind(this)}>
                                <optgroup>
                                    <option value="normal">Normal</option>
                                </optgroup>
                                <optgroup>
                                    <option value="darken">Darken</option>
                                    <option value="multiply">Multiply</option>
                                    <option value="color-burn">Color Burn</option>
                                </optgroup>
                                <optgroup>
                                    <option value="lighten">Lighten</option>
                                    <option value="screen">Screen</option>
                                    <option value="color-dodge">Color Dodge</option>
                                </optgroup>
                                <optgroup>
                                    <option value="overlay">Overlay</option>
                                    <option value="soft-light">Soft Light</option>
                                    <option value="hard-light">Hard Light</option>
                                </optgroup>
                                <optgroup>
                                    <option value="difference">Difference</option>
                                    <option value="exclusion">Exclusion</option>
                                </optgroup>
                                <optgroup>
                                    <option value="hue">Hue</option>
                                    <option value="saturation">Saturation</option>
                                    <option value="color">Color</option>
                                    <option value="luminosity">Luminosity</option>
                                </optgroup>
                            </InputSelect>
                        </div>
                    </div>
                    <div className={"sidebar__group" + ((elementTypes!=='mixed')&&(elementTypes!=='group')?'':' hidden')}>
                        <h3>Color</h3>
                        <div className="sidebar__grid">
                            <label title="Fill Style"><i className='material-icons'>format_color_fill</i></label>
                            <InputColor which="backgroundColor" value={this.getValue(elementValues,'backgroundColor')} change={this.updateValue.bind(this)} />
                        </div>
                    </div>
                    <div className={"sidebar__group" + ((elementTypes!=='mixed')&&(elementTypes!=='group')?'':' hidden')}>
                        <h3>Border</h3>
                        <div className="sidebar__grid">
                            <label title="Border Style"><i className='material-icons'>border_style</i></label>
                            <InputColor disabled={pickLength<1?"disabled":""} which="borderColor" value={this.getValue(elementValues,'borderColor')} change={this.updateValue.bind(this)} />
                            <InputSelect className="span-3" disabled={pickLength<1?"disabled":""} which="borderStyle" value={this.getValue(elementValues,'borderStyle')} change={this.updateValue.bind(this)}>
                                <optgroup>
                                    <option value="none">None</option>
                                </optgroup>
                                <optgroup>
                                    <option value="solid">Solid</option>
                                    <option value="dashed">Dashed</option>
                                    <option value="dotted">Dotted</option>
                                    <option value="double">Double</option>
                                    <option value="groove">Groove</option>
                                    <option value="ridge">Ridge</option>
                                    <option value="inset">Inset</option>
                                    <option value="outset">Outset</option>
                                </optgroup>
                            </InputSelect>
                            <InputNumeric disabled={pickLength<1?"disabled":""} min={0} which="borderWidth" value={this.getValue(elementValues,'borderWidth')} change={this.updateValue.bind(this)} />
                        </div>
                    </div>
                    <div className={"sidebar__group"+(this.state.filtersCollapsed?" collapsed":"") + ((elementTypes!=='artboard')?'':' hidden')}>
                        <h3>Filters <button className="collapse" onClick={()=>{this.setState({filtersCollapsed:!this.state.filtersCollapsed})}}><i className="material-icons dd">arrow_drop_down</i><i className="material-icons du">arrow_drop_up</i></button></h3>
                        <FilterComposer disabled={pickLength<1?"disabled":""} elements={this.props.pick.elements} which="filter" value={this.getValue(elementValues,'filter')} change={this.updateValue.bind(this)}  />
                    </div>
                </div>
                <div className="sidebar-geek">
                    <div className="sidebar__group">
                        <h3>Advanced <span className="tip">(It&#39;s just CSS)</span></h3>
                        <CssNavigator addProp={this.addProp.bind(this)} deleteProp={this.deleteProp.bind(this)} elementValues={elementValues} getValue={this.getValue.bind(this)} updateValue={this.updateValue.bind(this)} />
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
const SmartElementsSidebarProperties = connect(mapStateToProps)(ElementsSidebarProperties);


export default SmartElementsSidebarProperties;
