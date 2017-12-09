import React, { Component } from 'react';

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
				let xy = {
					x:(e.type==='touchmove'?e.originalEvent.touches[0].pageX:e.pageX),
					y:(e.type==='touchmove'?e.originalEvent.touches[0].pageY:e.pageY)
				};
	            this.props.mouseMoveFunction(xy);
	            this.props.eventReceptorFunction({
	                theEvent:'mousemove',
	                e:e
	            });
			}
		}.bind(this);
	}
	render() {
		return (
			<div
    			className="input-logger"
    			onMouseDown={this.logEvent}
    			onMouseUp={this.logEvent}
    			onMouseMove={this.logMove}
			>{ this.props.children }</div>
		);
	}
};

export default InputLogger;
