import React, { Component } from 'react';
import InputNumeric from '../Inputs/InputNumeric/';
import InputColor from '../Inputs/InputColor/';

import './styles.css';



class ShadowHandler extends Component {
    generateValue(props){
        return(props['x']+'px ' + props['y'] + 'px ' + props['blur'] + 'px ' + props['color']);
    }
    changeShadow(e,props,prop){
        let val = e.target.value;
        props[prop] = val;

        this.props.change({
            target:{
                value:this.generateValue(props),
                dataset:{
                    which:this.props.what
                }
            }
        })
    }
    generateProps(props){
        if (props){
            let pa = props.split(' ');
            let x = parseFloat(pa[0].replace('px',''));
            let y = parseFloat(pa[1].replace('px',''));
            let b = parseFloat(pa[2].replace('px',''));
            let c = pa[3];
            let ro = {
                x:x,
                y:y,
                blur:b,
                color:c
            };
            return ro;
        }
        return {
            x:'0',
            y:'0',
            blur:'0',
            color:'rgba(0,0,0,1)'
        }
    }
    render(){
        let sProps = this.generateProps(this.props.value);
        return(
            <div className="shadow-handler">
                <InputNumeric value={sProps.x} change={(e)=>{this.changeShadow(e,sProps,'x')}} disabled={this.props.disabled} />
                <InputNumeric value={sProps.y} change={(e)=>{this.changeShadow(e,sProps,'y')}} disabled={this.props.disabled} />
                <InputNumeric value={sProps.blur} change={(e)=>{this.changeShadow(e,sProps,'blur')}} min={0} disabled={this.props.disabled} />
                <InputColor value={sProps.color} change={(e)=>{this.changeShadow(e,sProps,'color')}} disabled={this.props.disabled} />
            </div>
        );
    }
}

export default ShadowHandler;
