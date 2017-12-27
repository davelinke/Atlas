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
            let Component = require('./SingleComponents/'+ddData[item].tag+'/').MenuItem;
            output.push(<Component key={ddData[item].tag} />);
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
    renderMenuHelpers(){
        return Object.entries(this.props.menu.menus).map((sub, key)=>{
            let output = [];
            let items = sub[1].items;
            for (const item in items) {
                let Component = require('./SingleComponents/'+items[item].tag+'/').MenuHelper;
                if (Component!==undefined){
                    output.push(<Component key={items[item].tag} />);
                }
            }
            return output;
        });
    }
    render(){
        return (
            <div className="top-header">
                <div className="menu">
                    {Object.entries(this.props.menu.menus).map((sub, key)=>{return <MenuSub key={key} sub={sub} />})}
                </div>
                <div className="menu__helpers">
                    {this.renderMenuHelpers()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(store) {
    return {
        menu:store.menu
    };
};
const SmartMenuBar = connect(mapStateToProps)(MenuBar);

export default SmartMenuBar;
