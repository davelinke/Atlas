import React, { Component } from 'react';
import { connect } from 'react-redux';
import Workarea from '../Workarea/';
import Artboard from '../Artboard/';
import cssTools from '../../factories/Css';
import Toolbar from '../Toolbar/';
import MenuBar from '../MenuBar/';
import store from '../../store';

import {Controlled as CodeMirror} from 'react-codemirror2';

import './styles.css';

import "../../../node_modules/codemirror/lib/codemirror.css";

class App extends Component {
    renderArtboards(){
        const artboards = [this.props.tree];
        return artboards.map((tree, i) => {
            return (<Artboard key={i} tree={tree}></Artboard>);
        });
    }
    updateTree(editor,data,val){
        let ob = null;
        try {
           ob =  JSON.parse(val)
        }
        catch (e) {
           console.log('oops',e);

        }
        if (ob) {
            store.dispatch({
                type:'TREE_FULL',
                val:ob
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
        let codeMirrorOptions = {
            mode:'javascript',
            indentWithTabs:true,
            lineNumbers:true
        };
        return (
            <div className="wrap">
                <style id="dynamicStylesheet" type="text/css"></style>
                <MenuBar />
                <div className={"main "+this.props.tools.current+' '+this.props.workarea.elementClass.join(' ')}>
                    <Toolbar></Toolbar>
                    <Workarea>{this.renderArtboards()}</Workarea>
                    <div className="sidebar">
                        <CodeMirror value={JSON.stringify(this.props.tree, null, 2)} onBeforeChange={this.updateTree} options={codeMirrorOptions} />
                    </div>
                </div>
            </div>
        );
    }
};

const mapStateToProps = function(store) {
  return {
    tree:store.tree,
    library:store.library,
    tools:store.tools,
    workarea:store.workarea
  };
};
const SmartApp = connect(mapStateToProps)(App);

export default SmartApp;
