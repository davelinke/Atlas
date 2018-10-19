import React, { Component } from 'react';
import ElementsSidebarProperties from '../ElementsSidebarProperties/';
import './styles.css';

class ElementsSidebar extends Component {
    constructor(props){
        super(props);
        this.state = {
            geekMode:false,
            activeTab:'properties'
        }
    }
    switchMode(){
        this.setState({
            geekMode:!this.state.geekMode
        })
    }
    render(){
        return (
            <div className={"sidebar "+this.state.activeTab+(this.state.geekMode?" geek-mode":'')}>
                <div className="sidebar__tabs">
                    <button className="sidebar__tab active">Properties <span className="geek-mode-switch material-icons" title="Geek Mode" onClick={()=>{this.setState({geekMode:!this.state.geekMode})}}>code</span></button>
                    {/* <button className="sidebar__tab">Actions</button> */}
                </div>
                <div className="sidebar__gap"></div>
                <ElementsSidebarProperties />
            </div>
        );
    }
}

export default ElementsSidebar;
