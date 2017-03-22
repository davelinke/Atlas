import React, { Component } from 'react';
import { connect } from 'react-redux';
import Element from './Element';

import './Artboard.css';

class Artboard extends Component {
    render(){
        console.log('artboard rendering');
        return (<Element specs={this.props.tree}/>);
    }
}

const mapStateToProps = function(store) {
  return {
    tree:store.tree
  };
};
const SmartArtboard = connect(mapStateToProps)(Artboard);


export default SmartArtboard;
