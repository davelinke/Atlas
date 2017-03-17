import React, { Component } from 'react';
import Element from './Element';

import './Artboard.css';

class Artboard extends Component {
    // constructor(props){
    //     super(props);
    // }
    render(){
        return (<Element specs={this.props.tree}/>);
    }
}

export default Artboard;
