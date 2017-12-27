import React, { Component } from 'react';
import { connect } from 'react-redux';
import Workarea from '../Workarea/';
import Artboard from '../Artboard/';
import cssTools from '../../factories/Css';
import Toolbar from '../Toolbar/';
import MenuBar from '../MenuBar/';
import LeftBar from '../LeftBar/';
import ElementsSidebar from '../ElementsSidebar/';
import store from '../../store';

import './styles.css';

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
        return (
            <div className="wrap">
                <style id="dynamicStylesheet" type="text/css"></style>
                <MenuBar />
                <div className={"main "+this.props.tools.current+' '+this.props.workarea.elementClass.join(' ')}>
                    <Toolbar></Toolbar>
                    <LeftBar />
                    <Workarea>{this.renderArtboards()}</Workarea>
                    <ElementsSidebar />
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
