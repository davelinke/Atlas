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
			if(eType==='touchstart'||eType==='touchend'){
				let rect = e.target.getBoundingClientRect();
				if(eType==='touchstart'){
					xy = this.props.filterFunction({
						x:e.originalEvent.touches[0].pageX,
						y:e.originalEvent.touches[0].pageY
					});
					xyo = this.props.filterFunction({
						x:e.originalEvent.touches[0].pageX - rect.left,
						y:e.originalEvent.touches[0].pageY - rect.top
					});

				} else {
					xy = this.props.filterFunction({
						x:this.props.mouseInfo().x,
						y:this.props.mouseInfo().y
					});
					xyo = this.props.filterFunction({
						x:this.props.mouseInfo().offset.x,
						y:this.props.mouseInfo().offset.y
					});
				}
			} else {
				// else is a mouse, so register the coordinates normally
				xy = this.props.filterFunction({
					x:e.pageX,
					y:e.pageY
				});
				xyo = this.props.filterFunction({
					x:e.nativeEvent.offsetX,
					y:e.nativeEvent.offsetY
				});
			}
			if(eType==='mousedown'||eType==='touchstart'){
                if (typeof(this.props.mouseDownFunction)!=='undefined'){
                    this.props.mouseDownFunction(e,xy,xyo);
                }

				//check what do we need so that we dont'save the full event
				// set the timeout for that will verify thel longpress
				this.longPressTimeout = setTimeout(function() {
					// of we get here, the it's a longpress
                    this.props.eventReceptorFunction({
						theEvent:'longpress',
						e:e
					});
					// clear the mousedown event (cause we just fired the longpress event)
					this.props.mouseDownClearingFunction();
				}.bind(this),1000);
			}


			if(eType==='mouseup'||eType==='touchend'){
				// check if the mousedown event still exists
				if(this.props.mouseInfo().isDown){
					// if it exists then longpress didn't fire
					clearTimeout(this.longPressTimeout);
					// send the mousedown event before the mouseup one
					this.props.eventReceptorFunction({
						theEvent:'mousedown',
						e:this.props.mouseInfo().mouseDownEvent
					});
					//clear the event from the variable
                    this.props.mouseDownClearingFunction();
				}
                this.props.mouseUpFunction(e,xy,xyo);

				// add an event listener to emulate doubleclick on touch devices
				if(eType==='touchend'){
					// check if doubletouch still exists
					if(this.props.mouseInfo().doubleTouch){
						clearTimeout(this.doubleTouchTimeout);
                        this.props.doubleTouchClear();
						this.props.eventReceptorFunction({
							theEvent:'dblclick',
							e:e
						});
					} else {
						this.doubleTouchTimeout = setTimeout(function(){
                            this.props.doubleTouchClear();
						}.bind(this),500);
						this.props.doubleTouchSet();
					}
				}
			}

            this.props.registerMouseEventType();
			// mousedown and touchstart we send differently to check that is not a longpress
			if(eType!=='mousedown'&&eType!=='touchstart'){
				this.props.eventReceptorFunction({
					theEvent:eType,
					e:e
				});
			}
		}.bind(this);

		this.logMove = function(e){
			// if the mouse is down, but i moved before the longpress timeout means i am not doing longpress, so clear the timeout
			if(this.props.mouseInfo().isDown){
				clearTimeout(this.longPressTimeout);
				//then send the mouse down event, cause it means we are dragging so we should start it
				this.props.eventReceptorFunction({
					theEvent:'mousedown',
					e:this.props.mouseInfo().mouseDownEvent //which is the mouse down event we saved
				});
                this.props.mouseDownClearingFunction();
			}
			let xy = this.props.filterFunction({
				x:(e.type==='touchmove'?e.originalEvent.touches[0].pageX:e.pageX),
				y:(e.type==='touchmove'?e.originalEvent.touches[0].pageY:e.pageY)
			});
            this.props.mouseMoveFunction(xy);
            if (this.props.mouseInfo().mouseEvent){
                if(this.props.mouseInfo().mouseEvent.type==='mousedown'||this.props.mouseInfo().mouseEvent.type==='touchstart'){
                    this.props.mouseDeltaFunction(xy);
    			}
            }
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
    			onTouchStart={this.logEvent}
    			onTouchEnd={this.logEvent}
    			onDoubleClick={this.logEvent}
    			onMouseMove={this.logMove}
    			onTouchMove={this.logMove}
			>{ this.props.children }</div>
		);
	}
};

export default InputLogger;
