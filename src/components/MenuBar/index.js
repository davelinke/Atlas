import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../../store';

import './styles.css';

class MenuSub extends Component{
    showMenu(sub){
        store.dispatch({
            type:'MENU_TOGGLE_SUB',
            value:sub
        });
    }
    buildMenuDropdown(ddData){
        let output = [];
        for (const item in ddData) {
            output.push(<div key={item} className="menu__dropdown-item {}">{ddData[item].label}</div>);
        }
        return output;
    }
    render(){
        return (
            <div key={this.props.sub[0]} className={(this.props.sub[1].visible?'menu__sub menu__sub--visible':'menu__sub')} onClick={()=>{this.showMenu(this.props.sub[0])}}>
                <button className="menu__label">{this.props.sub[0]}</button>
                <div className="menu__backdrop"></div>
                <div className="menu__dropdown">{this.buildMenuDropdown(this.props.sub[1].items)}</div>
            </div>
        );
    }
}

class MenuBar extends Component {
    render(){
        return (<div className="menu">{Object.entries(this.props.menu.menus).map((sub, key)=>{return <MenuSub key={key} sub={sub} />})}</div>);
    }
}

const mapStateToProps = function(store) {
    return {
        menu:store.menu
    };
};
const SmartMenuBar = connect(mapStateToProps)(MenuBar);

export default SmartMenuBar;
