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

		this.zoomFn = async (e) => {
			store.dispatch({
				type:'SCREEN_ZOOM',
				val:e.detail.scale
			});
		}
		this.panFn = function(e){
		}
		this.transformFn = (e) => {
			return window.dispatchEvent(new Event('resize'));
		};
	}
	shouldComponentUpdate(nextProps){
		let itShould = (this.props.cursor!==nextProps.cursor);
		return itShould;
	}
	componentDidUpdate(prevProps){}
	componentDidMount(){
        if (this.refs.inputLogger!==undefined){
			let il = this.refs.inputLogger;

			//lets talk about origin
			let origin = {
				x:'calc(50% - 50vw)',
				y:'calc(50% - 50vh)',
				z:0
			};

			// initialize zoompan
			let zoomInstance = zoom(il,{
	            smoothScroll: false,
				panButton:1,
				zoomDoubleClickSpeed: 1,
				transformOrigin:origin
	        });
			il.addEventListener('zoom',this.zoomFn);
			il.addEventListener('panend',this.panFn);
			il.addEventListener('transform',this.transformFn);
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
			this.refs.inputLogger.removeEventListener('transform',this.transformFn);
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
