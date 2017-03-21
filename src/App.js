import React, { Component } from 'react';
import Workarea from './components/Workarea';
import Artboard from './components/Artboard';
import cssTools from './factories/Css';
//import { Link } from 'react-router';
//import Todo from './components/Todo';
//import AddTodo from './components/AddTodo';

import './App.css';

class App extends Component {
    constructor(){
        super();
        this.renderArtboards = function(){
            const artboards = [this.props.tree];
            return artboards.map((tree, i) => {
                return (<Artboard key={i} tree={tree}></Artboard>);
            });
        }
    }
    componentWillMount(){
        // initialize stuff
    }
    componentDidMount(){
        // initialize stuff that requires dom
        let classes = this.props.library.classes;
        let styleSheet = cssTools.getStylesheet('dynamicStylesheet');
        if (styleSheet) {
            cssTools.initializeSheet(styleSheet,classes);
        }
    }

    render() {
        return (
            <div className="wrap">
                <style id="dynamicStylesheet" type="text/css"></style>
                <div className="menubar">File</div>
                <div className="main">
                    <div className="toolbar">A</div>
                    <Workarea mouse={this.props.mouse} screen={this.props.screen} tools={this.props.tools}>{this.renderArtboards()}</Workarea>
                    <div className="sidebar">sidebar</div>
                </div>
            </div>
        );
    }
};

export default App;
