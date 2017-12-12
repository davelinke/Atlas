import React, { Component } from 'react';
import { connect } from 'react-redux';
import TreeHelpers from '../../factories/Tree';
import store from '../../store';
import InputNumeric from '../Inputs/InputNumeric/';
import InputColor from '../Inputs/InputColor/'
import './styles.css';

class ElementsSidebar extends Component {
    elementValues(){
        // let's get the pick
        let pick = this.props.pick.elements;

        // let's handle the pick
        if (pick.length===0){
            // nothings selected, thus we present the arboard props

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
        return (this.props.pick.elements.length>0?true:false);
    }
    getValue(style,prop){
        if (style && style[prop]){
            console.log(style[prop])
            return style[prop];
        }
        return '';
    }
    updateValue(e){
        // let's get the pick
        let dataType = function(data,type){
            switch(type){
                case ('num'):
                    return parseInt(data,10);
                default:
                    return data;
            }
        };
        let pick = this.props.pick.elements;
        let nuTree = Object.assign({},this.props.tree);
        let zeInput = e.target;
        let which = zeInput.dataset.which;
        let zeValue = dataType(zeInput.value,zeInput.dataset.type);
        // let's handle the pick
        if (pick.length===0){
            // nothings selected, thus we present the arboard props

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
        console.log(nuTree);
        store.dispatch({
            type:'TREE_FULL',
            val:nuTree
        });
    }
    render(){
        let elementValues = this.elementValues();
        console.log('woot');
        return (
            <div>
                <div className="cols-3">
                    <div>Position</div>
                    <div>
                        <label>Top</label>
                        <InputNumeric which="top" value={this.getValue(elementValues,'top')} change={this.updateValue.bind(this)} />
                    </div>
                    <div>
                        <label>Left</label>
                        <InputNumeric which="left" value={this.getValue(elementValues,'left')} change={this.updateValue.bind(this)} />
                    </div>
                </div>
                <div className="cols-3">
                    <div>Dimensions</div>
                    <div>
                        <label>Width</label>
                        <InputNumeric which="width" value={this.getValue(elementValues,'width')} change={this.updateValue.bind(this)} />
                    </div>
                    <div>
                        <label>Height</label>
                        <InputNumeric which="height" value={this.getValue(elementValues,'height')} change={this.updateValue.bind(this)} />
                    </div>
                </div>
                <div className="cols-3">
                    <div>Color</div>
                    <div>
                        <label>Background</label>
                        <InputColor which="backgroundColor" value={this.getValue(elementValues,'backgroundColor')} change={this.updateValue.bind(this)} />
                    </div>
                    <div>
                        <label>Border</label>
                        <InputColor which="borderColor" value={this.getValue(elementValues,'borderColor')} change={this.updateValue.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(store) {
    return {
        pick:store.pick,
        tree:store.tree
    };
};
const SmartElementsSidebar = connect(mapStateToProps)(ElementsSidebar);


export default SmartElementsSidebar;
