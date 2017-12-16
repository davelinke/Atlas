import React, { Component } from 'react';

import './styles.css';



class CssNavigator extends Component {
    constructor(props){
        super(props);
        this.state = {
            propName:'',
            propValue:''
        };
    }
    changeProp(e){
        let elmt = e.target;
        let val = elmt.value;
        let prop = elmt.dataset.prop;
        this.props.updateValue({
            target:{
                value:val,
                dataset:{
                    which:prop,
                    type:(isNaN(val)?"string":"number")
                }
            }
        })
    }
    deleteProp(e){
        let elmt = e.target;
        let prop = elmt.dataset.prop;
        this.props.deleteProp({
            target:{
                dataset:{
                    which:prop
                }
            }
        })
    }
    addProp(e){
        e.preventDefault();

        this.props.addProp({
            propName:this.state.propName.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }),
            propValue:this.state.propValue
        });
        this.setState({
            propName:'',
            propValue:''
        })
        this.refs.propName.focus();
    }
    definePropKey(e){
        this.setState({
            propName:e.target.value
        })
    }
    definePropValue(e){
        this.setState({
            propValue:e.target.value
        })
    }
    renderProperties(){
        let output = [];
        let styles = this.props.elementValues;
        let toCss = (myStr)=>{
            return myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
        }
        // lets see first an expanded array of pros in the whole pick
        let propObject = {};
        for (let element of styles){
            Object.assign(propObject,element);
        }

        for (let prop in propObject){
            output.push(
                <div className="css-prop" key={prop}>
                    <label className="css-prop-label">{toCss(prop)}</label>
                    <input className="css-prop-val" type="text" data-prop={prop} value={this.props.getValue(styles,prop)} onChange={this.changeProp.bind(this)} />
                    <button className="button button-icon material-icons" data-prop={prop} onClick={this.deleteProp.bind(this)}>close</button>
                </div>
            );
        }
        return output
    }
    render(){

        return(
            <div className="css-nav">
                {this.renderProperties()}
                <form className="css-prop" onSubmit={this.addProp.bind(this)}>
                    <input ref="propName" type="text" onChange={this.definePropKey.bind(this)} value={this.state.propName} placeholder="Property" />
                    <input type="text" onChange={this.definePropValue.bind(this)} value={this.state.propValue} placeholder="Value" />
                    <button type="submit" className="button button-icon material-icons">add_circle_outline</button>
                </form>
            </div>
        );
    }
}

export default CssNavigator;
