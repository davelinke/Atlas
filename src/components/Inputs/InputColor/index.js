import React, { Component } from 'react';
import './styles.css';
import { ChromePicker } from 'react-color';

class InputColor extends Component {
    constructor(props){
        super(props);
        this.state = {
            pickerVisible:false
        }
        this.setColor = (color)=>{
            let c = color.rgb;
            let colorString = 'rgba('+c.r+','+c.g+','+c.b+','+c.a+')';
            this.props.change({
                target:{
                    value:colorString,
                    dataset:{
                        which:this.props.which,
                        type:"string"
                    }
                }
            })
        }
        this.togglePicker = ()=>{
            if (!this.props.disabled){
                this.setState({
                    pickerVisible:!this.state.pickerVisible
                })
            }
        };
    }
    render(){
        return (
            <div className={"input-color"+(this.props.disabled?' disabled':'')}>
                <div className="input-color__swatch-wrap">
                    <div className="input-color__swatch" style={{backgroundColor:this.props.value}} onClick={this.togglePicker}></div>
                </div>
                <ChromePicker className={this.state.pickerVisible?'visible':''} color={this.props.value} onChangeComplete={this.setColor} />
                <div  className={'input-color__backdrop '+(this.state.pickerVisible?'visible':'')} onClick={this.togglePicker}></div>
            </div>
        );
    }
}
export default InputColor;
