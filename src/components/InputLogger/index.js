import React, { Component } from 'react';
import store from '../../store';

class InputLogger extends Component {
	constructor(props){
		super(props);
		this.mouseDown = false;
		this.logEvent = function(e){
			e.persist();
			e.preventDefault();
			let xy;
            let eType = e.type;
			let il = this.refs.inputLogger;
            xy = {
				x:e.pageX + il.scrollLeft,
				y:e.pageY + il.scrollTop
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
            this.storeScroll();
            this.refs.inputLogger.addEventListener("scroll",this.storeScroll.bind(this));
        }
    }

    componentWillUnmount() {
        if (this.refs.inputLogger!==undefined){
            this.refs.inputLogger.removeEventListener("scroll", this.storeScroll.bind(this));
        }
    }
	render() {
		return (
			<div ref="inputLogger" style={{zoom:this.props.zoom,cursor:this.props.cursor}}
    			className="input-logger"
    			onMouseDown={this.logEvent}
    			onMouseUp={this.logEvent}
    			onMouseMove={this.logMove}
			>{ this.props.children }</div>
		);
	}
};

export default InputLogger;
