import React, { Component } from 'react';
import InputNumeric from '../Inputs/InputNumeric/';
import ShadowHandler from '../ShadowHandler/';

import './styles.css';

class FilterComposer extends Component {
    toggle(e,props){
        console.log(props);
        let what = e.target.dataset.what;
        let nuState = Object.assign({},props);
        nuState[what].on = !nuState[what].on
        this.zap(nuState);
    }
    generateValue(props){
        let output = '';
        for (let filter in props){
            if (props[filter].on){
                output += filter+'('+props[filter].value+props[filter].appendix+') ';
            }
        }
        return output.trim();
    }
    zap(props){
        let textValue = this.generateValue(props);
        this.props.change({
            target:{
                value:textValue,
                dataset:{
                    which:'filter'
                }
            }
        });
    }
    updateFilter(e,props){
        let value = e.target.value;
        let nuState = Object.assign({},props);
        let which = e.target.dataset.which;
        nuState[which].value = value;
        this.zap(nuState);
    }
    formatProps(val){
        let propObject = {
            'drop-shadow':{
                on:false,
                value:'0px 0px 0px rgba(0,0,0,1)',
                appendix:''
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
            'hue-rotate':{
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
        };
        if(val){
            let effectsArray = val.split(')').filter(function(x){
              return (x !== (undefined || null || ''));
            });
            for (let effect of effectsArray){
                let effectPieces = effect.split('(');
                let effectName = effectPieces[0].trim();
                let effectVal = effectPieces[1];
                if (effectName!=='drop-shadow'){
                    let effectNumericVal = effectVal.replace(/\D+/g, '');
                    let effectUnit = effectVal.replace(effectNumericVal,'');
                    propObject[effectName] = {
                        on:true,
                        value:parseFloat(effectNumericVal),
                        appendix:effectUnit
                    }
                } else {
                    propObject[effectName] = {
                        on:true,
                        value:(effectPieces.length>2?effectPieces[1]+'('+effectPieces[2]+')':effectPieces[1]),
                        appendix:''
                    }
                }
            }
        }
        return propObject;
    }
    render(){
        let fProps = this.formatProps(this.props.value);
        return(
            <div className="filters">
                <div className="sidebar__grid">
                    <input type="checkbox" data-props={fProps} data-what="drop-shadow" onChange={(e)=>{this.toggle(e,fProps)}} checked={fProps['drop-shadow'].on} />
                    <label className="span-2 text-left js-start">Drop Shadow</label>
                    <div className="span-3">
                        <ShadowHandler what='drop-shadow' disabled={fProps['drop-shadow'].on?"":"disabled"} value={fProps['drop-shadow'].value} change={(e)=>{this.updateFilter(e,fProps)}} />
                    </div>


                    <input type="checkbox" data-what="blur" onChange={(e)=>{this.toggle(e,fProps)}} checked={fProps.blur.on} />
                    <label className="span-2 text-left js-start">Blur</label>
                    <div className="span-3">
                        <div className="span-3">
                            <InputNumeric disabled={fProps.blur.on?"":"disabled"} min={0} step={1} which="blur" value={fProps.blur.value} change={(e)=>{this.updateFilter(e,fProps)}} />
                        </div>
                    </div>


                    <input type="checkbox" data-what="brightness" onChange={(e)=>{this.toggle(e,fProps)}} checked={fProps.brightness.on} />
                    <label className="span-2 text-left js-start">Brightness</label>
                    <div className="span-3">
                        <InputNumeric disabled={fProps.brightness.on?"":"disabled"} min={0} step={1} which="brightness" value={fProps.brightness.value} change={(e)=>{this.updateFilter(e,fProps)}} />
                    </div>


                    <input type="checkbox" data-what="contrast" onChange={(e)=>{this.toggle(e,fProps)}} checked={fProps.contrast.on} />
                    <label className="span-2 text-left js-start">Contrast</label>
                    <div className="span-3">
                        <InputNumeric disabled={fProps.contrast.on?"":"disabled"} min={0} step={1} which="contrast" value={fProps.contrast.value} change={(e)=>{this.updateFilter(e,fProps)}} />
                    </div>


                    <input type="checkbox" data-what="hue-rotate" onChange={(e)=>{this.toggle(e,fProps)}} checked={fProps['hue-rotate'].on} />
                    <label className="span-2 text-left js-start">Hue</label>
                    <div className="span-3">
                        <InputNumeric disabled={fProps['hue-rotate'].on?"":"disabled"} min={0} max={360} step={'any'} which="hue-rotate" value={fProps['hue-rotate'].value} change={(e)=>{this.updateFilter(e,fProps)}} />
                    </div>


                    <input type="checkbox" data-what="saturate" onChange={(e)=>{this.toggle(e,fProps)}} checked={fProps.saturate.on} />
                    <label className="span-2 text-left js-start">Saturation</label>
                    <div className="span-3">
                        <InputNumeric disabled={fProps.saturate.on?"":"disabled"} min={0} step={1} which="saturate" value={fProps.saturate.value} change={(e)=>{this.updateFilter(e,fProps)}} />
                    </div>


                    <input type="checkbox" data-what="invert" onChange={(e)=>{this.toggle(e,fProps)}} checked={fProps.invert.on} />
                    <label className="span-2 text-left js-start">Invert</label>
                    <div className="span-3">
                        <InputNumeric disabled={fProps.invert.on?"":"disabled"} min={0} max={100} step={'any'} which="invert" value={fProps.invert.value} change={(e)=>{this.updateFilter(e,fProps)}} />
                    </div>


                    <input type="checkbox" data-what="grayscale" onChange={(e)=>{this.toggle(e,fProps)}} checked={fProps.grayscale.on} />
                    <label className="span-2 text-left js-start">Grayscale</label>
                    <div className="span-3">
                        <InputNumeric disabled={fProps.grayscale.on?"":"disabled"} min={0} max={100} step={'any'} which="grayscale" value={fProps.grayscale.value} change={(e)=>{this.updateFilter(e,fProps)}} />
                    </div>

                    <input type="checkbox" data-what="sepia" onChange={(e)=>{this.toggle(e,fProps)}} checked={fProps.sepia.on} />
                    <label className="span-2 text-left js-start">Sepia</label>
                    <div className="span-3">
                        <InputNumeric disabled={fProps.sepia.on?"":"disabled"} min={0} max={100} step={'any'} which="sepia" value={fProps.sepia.value} change={(e)=>{this.updateFilter(e,fProps)}} />
                    </div>
                </div>
            </div>
        );
    }
}

export default FilterComposer;
