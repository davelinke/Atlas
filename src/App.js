import React, { Component } from 'react';
import Workarea from './components/Workarea';
import Artboard from './components/Artboard';
import store from './store';
import cssTools from './factories/Css';
//import { Link } from 'react-router';
//import Todo from './components/Todo';
//import AddTodo from './components/AddTodo';

import './App.css';

const state = store.getState;

class App extends Component {
    constructor(){
        super();
        this.renderArtboards = function(){
            const artboards = [state().tree];
            return artboards.map((tree, i) => {
                return (<Artboard key={i} tree={tree}></Artboard>);
            });
        }
    }
    componentWillMount(){
        //console.log(state().tree);
        // initialize stuff
    }
    componentDidMount(){
        // initialize stuff that requires dom
        let classes = state().library.classes;
        let styleSheet = cssTools.getStylesheet('dynamicStylesheet');
        if (styleSheet) {
            for (let i=0; i < classes.length;i++){
                let ruleContents = cssTools.objectToCss(classes[i].style);
                let rule = '.'+classes[i].label+'{'+ruleContents+'}';
                styleSheet.insertRule(rule,i);
            }
        }
    }

    render() {
        return (
            <div className="wrap">
                <style id="dynamicStylesheet" type="text/css"></style>
                <div className="menubar">File</div>
                <div className="main">
                    <div className="toolbar">A</div>
                    <Workarea>{this.renderArtboards()}</Workarea>
                    <div className="sidebar">sidebar</div>
                </div>
            </div>
        );
    }
};

export default App;
