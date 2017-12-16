import React, { Component } from 'react';
import InputNumeric from '../Inputs/InputNumeric/'

import './styles.css';



class CssNavigator extends Component {
    constructor(props){
        super(props);
        this.state = {
            dropShadow:{
                on:false,
                value:'0px 1px 2px rgba(0,0,0,0.5)'
            },
            blur:{
                on:false,
                value:0,
                appendix:'px'
            },
            brightness:{
                on:false,
                value:100,
                appendix:'%'
            },
            contrast:{
                on:false,
                value:100,
                appendix:'%'
            },
            grayscale:{
                on:false,
                value:0,
                appendix:'%'
            },
            hueRotate:{
                on:false,
                value:0,
                appendix:'deg'
            },
            invert:{
                on:false,
                value:0,
                appendix:'%'
            },
            saturate:{
                on:false,
                value:100,
                appendix:'%'
            },
            sepia:{
                on:false,
                value:0,
                appendix:'%'
            }
        }
    }
    toggle(e){
        let what = e.target.dataset.what;
        let nuState = Object.assign({},this.state);
        nuState[what].on = !nuState[what].on
        this.setState(nuState);
        this.zap();
    }
    generateValue(){
        let output = '';
        for (let filter in this.state){
            if (this.state[filter].on){
                output += filter+'('+this.state[filter].value+this.state[filter].appendix+') ';
            }
        }
        return output;
    }
    zap(){
        let textValue = this.generateValue();
        this.props.change({
            target:{
                value:textValue,
                dataset:{
                    which:'filter'
                }
            }
        });
    }
    updateFilter(e){
        let value = e.target.value;
        let nuState = Object.assign({},this.state);
        let which = e.target.dataset.which;
        nuState[which].value = value;
        this.setState(nuState);
        this.zap();
    }
    render(){

        return(
            <div className="filters">
                <div className="sidebar__grid">
                    <input type="checkbox" data-what="dropShadow" onChange={this.toggle.bind(this)} value={this.state.dropShadow.on} />
                    <label className="span-2 text-left js-start">Drop Shadow</label>
                    <div className="span-3"></div>
                </div>
                <div className="sidebar__grid">
                    <input type="checkbox" data-what="blur" onChange={this.toggle.bind(this)} value={this.state.blur.on} />
                    <label className="span-2 text-left js-start">Blur</label>
                    <div className="span-3"><InputNumeric disabled={this.state.blur.on?"":"disabled"} min={0} step={1} which="blur" value={this.state.blur.value} change={this.updateFilter.bind(this)} /></div>
                </div>
                <div className="sidebar__grid">
                    <input type="checkbox" data-what="brightness" onChange={this.toggle.bind(this)} value={this.state.brightness.on} />
                    <label className="span-2 text-left js-start">Brightness</label>
                    <div className="span-3"></div>
                </div>
                <div className="sidebar__grid">
                    <input type="checkbox" data-what="constrast" onChange={this.toggle.bind(this)} value={this.state.contrast.on} />
                    <label className="span-2 text-left js-start">Contrast</label>
                    <div className="span-3"></div>
                </div>
                <div className="sidebar__grid">
                    <input type="checkbox" data-what="hueRotate" onChange={this.toggle.bind(this)} value={this.state.hueRotate.on} />
                    <label className="span-2 text-left js-start">Hue</label>
                    <div className="span-3"></div>
                </div>
                <div className="sidebar__grid">
                    <input type="checkbox" data-what="saturate" onChange={this.toggle.bind(this)} value={this.state.saturate.on} />
                    <label className="span-2 text-left js-start">Saturation</label>
                    <div className="span-3"></div>
                </div>
                <div className="sidebar__grid">
                    <input type="checkbox" data-what="invert" onChange={this.toggle.bind(this)} value={this.state.invert.on} />
                    <label className="span-2 text-left js-start">Invert</label>
                    <div className="span-3"></div>
                </div>
                <div className="sidebar__grid">
                    <input type="checkbox" data-what="grayscale" onChange={this.toggle.bind(this)} value={this.state.grayscale.on} />
                    <label className="span-2 text-left js-start">Grayscale</label>
                    <div className="span-3"></div>
                </div>
                <div className="sidebar__grid">
                    <input type="checkbox" data-what="sepia" onChange={this.toggle.bind(this)} value={this.state.sepia.on} />
                    <label className="span-2 text-left js-start">Sepia</label>
                    <div className="span-3"></div>
                </div>
            </div>
        );
    }
}

export default CssNavigator;
