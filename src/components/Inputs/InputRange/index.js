import React, { Component } from 'react';
import './styles.css';

class InputRange extends Component {
    render(){
        return (<input className={'input-range '+this.props.className} type="range" min={this.props.min} max={this.props.max} step={this.props.step} data-which={this.props.which} data-type="number" value={this.props.value} onChange={this.props.change} disabled={this.props.disabled} />);
    }
}
export default InputRange;
