import React, { Component } from 'react';
import store from '../../store';
import zoom from 'panzoom';

class InputLogger extends Component {
	constructor(props){
		super(props);
		this.mouseDown = false;
		this.logEvent = function(e){
			e.persist();
			e.preventDefault();
			let xy;
            let eType = e.type;
			xy = {
				x:e.pageX,
				y:e.pageY
			};
			switch (eType) {
				case 'mousedown':
					this.mouseDown = true;
					this.props.mouseDownFunction(e,xy);
					break;
				case 'mouseup':
					this.mouseDown = false;
					this.props.mouseUpFunction(e,xy);
					break;
				default:
					console.log('woot');
			}

			this.props.registerMouseEventType();
			this.props.eventReceptorFunction({
                theEvent:eType,
                e:e
            });
		}.bind(this);

		this.logMove = function(e){
			if (this.mouseDown){
				//console.log(e);
				let il = this.refs.inputLogger;
				let xy = {
					x:(e.type==='touchmove'?e.originalEvent.touches[0].pageX:e.pageX) + il.scrollLeft,
					y:(e.type==='touchmove'?e.originalEvent.touches[0].pageY:e.pageY) + il.scrollTop
				};
	            this.props.mouseMoveFunction(xy);
	            this.props.eventReceptorFunction({
	                theEvent:'mousemove',
	                e:e
	            });
			}
		}.bind(this);

		this.dispatchZoom = function(nextZoom){
		    return new Promise((resolve,reject)=>{
		        resolve(store.dispatch({
		            type:'SCREEN_ZOOM',
		            val:nextZoom
		        }));
		    });
		};

		this.zoomFn = async (e) => {
			return await this.dispatchZoom(e.detail.scale);
		}
		this.panFn = function(e){
			return window.dispatchEvent(new Event('resize'));
		}
	}
	shouldComponentUpdate(nextProps){
		let itShould = (this.props.cursor!==nextProps.cursor)||(this.props.zoom!==nextProps.zoom);
		return itShould;
	}
	componentDidUpdate(prevProps){
		if (this.props.zoom!==prevProps.zoom){
			window.dispatchEvent(new Event('resize'));
		}
    }
	storeScroll(){
        if (this.refs.inputLogger!==undefined){
            let il = this.refs.inputLogger;
            store.dispatch({
                type:'SCREEN_SCROLL',
                val:{
					top:il.scrollTop,
					left:il.scrollLeft
				}
            });

			window.dispatchEvent(new Event('resize'));
        }
    }
	componentDidMount(){
        if (this.refs.inputLogger!==undefined){

			// initialize zoompan
			let zoomInstance = zoom(this.refs.inputLogger,{
	            smoothScroll: false,
				panButton:1,
				zoomDoubleClickSpeed: 1
	        });
			this.refs.inputLogger.addEventListener('zoom',this.zoomFn);
			this.refs.inputLogger.addEventListener('panend',this.panFn);
	        store.dispatch({
	            type:'PUBLIC_ADD',
	            key:'zoomInstance',
	            val:zoomInstance
	        });

        }
    }

    componentWillUnmount() {
        if (this.refs.inputLogger!==undefined){
			this.refs.inputLogger.removeEventListener('zoom',this.zoomFn);
			this.refs.inputLogger.removeEventListener('panend',this.panFn);
        }
    }
	render() {
		return (
			<div ref="inputLogger" style={{cursor:this.props.cursor}}
    			className="input-logger"
    			onMouseDown={this.logEvent}
    			onMouseUp={this.logEvent}
    			onMouseMove={this.logMove}
			>{ this.props.children }</div>
		);
	}
};

export default InputLogger;
