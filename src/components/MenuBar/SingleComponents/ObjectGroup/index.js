import React, { Component } from 'react';
import { connect } from 'react-redux';
//import store from '../../../../store';

import './styles.css';

export class DumbMenuItem extends Component {
    group(){
        // console.log('group');
        // store.dispatch({
        //     type:'TREE'
        // });
    }
    render(){
        return (
            <div>
                <button className="menu__dropdown-item" onClick={this.group} disabled={(this.props.pick.elements.length<2)?'disabled':''}><span className="flex-loose">Group</span></button>
            </div>
        )
    }
}

const mapStateToProps = function(store) {
    return {
        pick:store.pick
    };
};

export const MenuItem = connect(mapStateToProps)(DumbMenuItem);
