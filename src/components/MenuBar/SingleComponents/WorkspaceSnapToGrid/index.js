import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../../../../store';

import './styles.css';

export class DumbMenuItem extends Component{
    snapToGrid(){
        store.dispatch({
            type:'WORKAREA_SNAP_TO_GRID'
        });
    }
    render(){
        return (
            <div>
                <button className="menu__dropdown-item" onClick={this.snapToGrid}><span className="flex-loose">Snap To Grid</span><i className={'flex-fixed material-icons' + (this.props.workarea.snapToGrid?'':' invisible')}>check</i></button>
            </div>
        )
    }
}

const mapStateToProps = function(store) {
    return {
        workarea:store.workarea
    };
};

export const MenuItem = connect(mapStateToProps)(DumbMenuItem);
