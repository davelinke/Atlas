import React, { Component } from 'react';
import './styles.css';

class InputSelect extends Component {
    render(){
        return (<select className={'input-select '+this.props.className} data-which={this.props.which} data-type="string" value={this.props.value} onChange={this.props.change} disabled={this.props.disabled}>{this.props.children}</select>);
    }
}
export default InputSelect;
