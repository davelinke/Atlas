import React, { Component } from 'react';

class InputLogger extends Component {
	constructor(props){
		super(props);
		this.logEvent = function(e){
			e.persist();
			e.preventDefault();
			let xy;
            let xyo;
            let eType = e.type;
            xy = this.props.filterFunction({
				x:e.pageX,
				y:e.pageY
			});
			xyo = this.props.filterFunction({
				x:e.nativeEvent.offsetX,
				y:e.nativeEvent.offsetY
			});

			switch (eType) {
				case 'mousedown':
					this.props.mouseDownFunction(e,xy,xyo);
					break;
				case 'mouseup':
					this.props.mouseUpFunction(e,xy,xyo);
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
			let xy = this.props.filterFunction({
				x:(e.type==='touchmove'?e.originalEvent.touches[0].pageX:e.pageX),
				y:(e.type==='touchmove'?e.originalEvent.touches[0].pageY:e.pageY)
			});
            this.props.mouseMoveFunction(xy);
            this.props.eventReceptorFunction({
                theEvent:'mousemove',
                e:e
            });
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
