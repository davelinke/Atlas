import React, { Component } from 'react';

class InputColor extends Component {
    render(){
        return (<input type="color" data-which={this.props.which} data-type="string" value={this.props.value} onChange={this.props.change} />);
    }
}
export default InputColor;
