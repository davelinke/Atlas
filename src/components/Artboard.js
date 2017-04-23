import React, { Component } from 'react';
import { connect } from 'react-redux';
import Element from './Element';

import './Artboard.css';

class Artboard extends Component {
    render(){
        console.log('artboard rendering');
        return (<Element specs={this.props.tree} pick={this.props.pick}/>);
    }
}

const mapStateToProps = function(store) {
  return {
    tree:store.tree,
    pick:store.pick
  };
};
const SmartArtboard = connect(mapStateToProps)(Artboard);


export default SmartArtboard;
