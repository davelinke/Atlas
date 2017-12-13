import React, { Component } from 'react';
import './styles.css';

class InputColor extends Component {
    render(){
        return (
            <div className="input--color" style={{backgroundColor:this.props.value}}>
                <input type="color" data-which={this.props.which} data-type="string" value={this.props.value} onChange={this.props.change} disabled={this.props.disabled} />
            </div>
        );
    }
}
export default InputColor;
