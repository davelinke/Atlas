import React, { Component } from 'react';
import CoordFilters from '../factories/CoordFilters';
import store from '../store';
import Events from '../factories/Events';
import Tools from '../factories/Tools';
//import History from '../factories/History';

import './Workarea.css';

const state = store.getState;

class Workarea extends Component {
	constructor(){
		super();
		this.logEvent = function(e){
			e.persist();
			e.preventDefault();
			let xy, xyo, eType = e.type;
			if(eType==='touchstart'||eType==='touchend'){
				let rect = e.target.getBoundingClientRect();
				if(eType==='touchstart'){
					xy = CoordFilters({
						x:e.originalEvent.touches[0].pageX,
						y:e.originalEvent.touches[0].pageY
					});
					xyo = CoordFilters({
						x:e.originalEvent.touches[0].pageX - rect.left,
						y:e.originalEvent.touches[0].pageY - rect.top
					});

				} else {
					xy = CoordFilters({
						x:state().mouse.x,
						y:state().mouse.y
					});
					xyo = CoordFilters({
						x:state().mouse.offset.x,
						y:state().mouse.offset.y
					});
				}
			} else {
				// else is a mouse, so register the coordinates normally
				xy = CoordFilters({
					x:e.pageX,
					y:e.pageY
				});
				xyo = CoordFilters({
					x:e.nativeEvent.offsetX,
					y:e.nativeEvent.offsetY
				});
			}
			if(eType==='mousedown'||eType==='touchstart'){

				store.dispatch({
					type: 'WORKAREA_CLASS',
					val:'mouse-down'
				});
				//disable undus till we mouseup
				store.dispatch({
					type: 'UNDO_DEACTIVATE'
				});
				// blur inputs
				document.activeElement.blur();
				// register mousedown coordinates
				store.dispatch({
					type: 'MOUSE_DOWN',
					val: xy
				});
				store.dispatch({
					type: 'MOUSE_OFFSET',
					val: xyo
				});
				store.dispatch({
					type: 'MOUSE_DRAG_DELTA',
					val: {
						x:0,
						y:0
					}
				});
				// save the mousedown event to a variable so we can pick it up in case it is not a longpress
				store.dispatch({
					type: 'MOUSE_DOWN_EVENT',
					val: e
				});
				store.dispatch({
					type: 'MOUSE_IS_DOWN',
					val: true
				});
				//check what do we need so that we dont'save the full event
				// set the timeout for that will verify thel longpress
				this.longPressTimeout = self.setTimeout(function() {
					// of we get here, the it's a longpress
					Events.sendEvent({
						theEvent:'longpress',
						e:e
					});
					// clear the mousedown event (cause we just fired the longpress event)
					store.dispatch({
						type: 'MOUSE_IS_DOWN',
						val: false
					});
				},1000);
			}


			if(eType==='mouseup'||eType==='touchend'){
				//$(this).removeClass('mouse-down');
				store.dispatch({
					type: 'WORKAREA_CLASS',
					val:''
				});
				// check if the mousedown event still exists
				if(state().mouse.isDown){
					// if it exists then longpress didn't fire
					clearTimeout(this.longPressTimeout);
					// send the mousedown event before the mouseup one
					Events.sendEvent({
						theEvent:'mousedown',
						e:state().mouse.mouseDownEvent
					});
					//clear the event from the variable
					store.dispatch({
						type: 'MOUSE_DOWN_EVENT',
						val: null
					});
					store.dispatch({
						type:'MOUSE_IS_DOWN',
						val:false
					});
				}

				// enable undos
				store.dispatch({type: 'UNDO_ACTIVATE'});

				// if (History.checkTreeChange(state())!==undefined){
				//     History.undoLog(state());
				// }

				// add an event listener to emulate doubleclick on touch devices
				if(eType==='touchend'){
					// check if doubletouch still exists
					if(state().mouse.doubleTouch){
						store.dispatch({type: 'MOUSE_DOUBLETOUCH_NULL'});
						Events.sendEvent({
							theEvent:'dblclick',
							e:e
						});

					} else {
						store.dispatch({
							type:'MOUSE_DOUBLETOUCH',
							val:{
								e:e,
								timeout:self.setTimeout(function(){
									store.dispatch({type: 'MOUSE_DOUBLETOUCH_NULL'});
								},500)
							}
						})
					}
				}
				// register the coordinates
				store.dispatch({
					type:'MOUSE_REGISTER_UP',
					val:{
						up:{
							x:xy.x,
							y:xy.y
						},
						offsetUp:{
							x:xyo.x,
							y:xyo.y
						}
					}
				});
			}

			store.dispatch({
				type:'MOUSE_EVENT',
				val:eType
			});

			// mousedown and touchstart we send differently to check that is not a longpress
			if(eType!=='mousedown'&&eType!=='touchstart'){

				Events.sendEvent({
					theEvent:eType,
					e:e
				});
			}
		}.bind(this);

		this.logMove = function(e){
			// if the mouse is down, but i moved before the longpress timeout means i am not doing longpress, so clear the timeout
			if(state().mouse.isDown){
				clearTimeout(this.longPressTimeout);
				//then send the mouse down event, cause it means we are dragging so we should start it
				Events.sendEvent({
					theEvent:'mousedown',
					e:state().mouse.mouseDownEvent //which is the mouse down event we saved
				});

				// i guess i nullify the down for the next time we come here
				store.dispatch({
					type:'MOUSE_IS_DOWN',
					val:null
				});
			}

			let so = state().screen.offset;
			var xy = CoordFilters({
				x:(e.type==='touchmove'?e.originalEvent.touches[0].pageX:e.pageX),
				y:(e.type==='touchmove'?e.originalEvent.touches[0].pageY:e.pageY)
			});
			store.dispatch({
				type:'MOUSE_POSITION',
				val:xy
			});
			store.dispatch({
				type:'MOUSE_OFFSET',
				val:xy
			});
			store.dispatch({
				type:'MOUSE_CANVAS_OFFSET',
				val:{
					x:xy.x - so.left,
					y:xy.y - so.top
				}
			});
			if(state().mouse.mouseEvent==='mousedown'||state().mouse.mouseEvent==='touchstart'){
				let downCoords = state().mouse.down;
				store.dispatch({
					type:'MOUSE_DRAG_DELTA',
					val:{
						x:xy.x - downCoords.x,
						y:xy.y - downCoords.y
					}
				});
			}
			Tools[state().tools.current][e.type](e);
		}.bind(this);
	}
	render() {
		return (
			<div
			className="workarea"
			onMouseDown={this.logEvent}
			onMouseUp={this.logEvent}
			onTouchStart={this.logEvent}
			onTouchEnd={this.logEvent}
			onDoubleClick={this.logEvent}
			onMouseMove={this.logMove}
			onTouchMove={this.logMove}
			></div>
		);
	}
};

export default Workarea;
