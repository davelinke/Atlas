import React, { Component } from 'react';

class InputNumeric extends Component {
    render(){
        return (<input type="number" data-which={this.props.which} data-type="number" value={this.props.value} onChange={this.props.change} disabled={this.props.disabled} />);
    }
}
export default InputNumeric;
