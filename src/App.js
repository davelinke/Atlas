import React, { Component } from 'react';
import Workarea from './components/Workarea';
import Artboard from './components/Artboard';
import store from './store';
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
    }

    render() {
        return (
            <div className="wrap">
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
