import React, { Component } from 'react';
import { connect } from 'react-redux';
import CoordFilters from '../factories/CoordFilters';
import Events from '../factories/Events';
import InputLogger from './InputLogger';
import store from '../store'

import './Workarea.css';

class Workarea extends Component {
	constructor(props){
		super(props);
		this.eventReceptorFunction = function(args){
			//console.log(args.e);
			store.dispatch({
				type: 'MOUSE_EVENT',
				val:args.e
			});
			Events.sendEvent(args,this.props.tools);
		}.bind(this);
		this.mouseInfo = function(){
			return this.props.mouse
		}.bind(this);
		this.mouseDownFunction = function(e,xy,xyo){
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
		}.bind(this);
		this.mouseDownClearingFunction = function(){
			store.dispatch({
				type: 'MOUSE_DOWN_EVENT',
				val: null
			});
			store.dispatch({
				type: 'MOUSE_IS_DOWN',
				val: false
			});
		}.bind(this);
		this.mouseUpFunction = function(e,xy,xyo){
			store.dispatch({
				type: 'WORKAREA_CLASS',
				val:''
			});

			// enable undos
			store.dispatch({type: 'UNDO_ACTIVATE'});

			// if (History.checkTreeChange(state())!==undefined){
			//     History.undoLog(state());
			// }


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
		}.bind(this);
		this.doubleTouchClear = function(){
			store.dispatch({type: 'MOUSE_DOUBLETOUCH_NULL'});
		}.bind(this);
		this.doubleTouchSet = function(){
			store.dispatch({type:'MOUSE_DOUBLETOUCH'});
		}.bind(this);
		this.registerMouseEventType = function(eType){
			store.dispatch({
				type:'MOUSE_EVENT',
				val:eType
			});
		}.bind(this);
		this.mouseMoveFunction = function(xy){
			let so = this.props.screen.offset;
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
		}.bind(this);
		this.mouseDeltaFunction = function(xy){
			//console.log('woot');
			let downCoords = this.props.mouse.down;
			store.dispatch({
				type:'MOUSE_DRAG_DELTA',
				val:{
					x:xy.x - downCoords.x,
					y:xy.y - downCoords.y
				}
			});
		}.bind(this);
		this.filterFunction = function(coords){
			return CoordFilters(coords,true,this.props.workarea,this.props.mouse,this.props.keyboard);
		}.bind(this);
	}
	componentDidUpdate(){
		console.log('workarea update');
	}
	render() {
		console.log('workarea rendering')
		return (
			<InputLogger
				eventReceptorFunction={this.eventReceptorFunction}
				filterFunction={this.filterFunction}
				doubleTouchSet={this.doubleTouchSet}
				doubleTouchClear={this.doubleTouchClear}
				mouseInfo={this.mouseInfo}
				mouseDownFunction={this.mouseDownFunction}
				mouseDownClearingFunction={this.mouseDownClearingFunction}
				mouseDownEventStore={this.mouseDownEventStore}
				mouseDeltaFunction={this.mouseDeltaFunction}
				mouseUpFunction={this.mouseUpFunction}
				mouseMoveFunction={this.mouseMoveFunction}
				registerMouseEventType={this.registerMouseEventType}
			>{this.props.children}</InputLogger>
		);
	}
};



const mapStateToProps = function(store) {
  //return store.main;
  return {
    mouse:store.mouse,
    tools:store.tools,
    screen:store.screen,
	workarea:store.workarea,
	keyboard:store.keyboard
  };
}
const SmartWorkarea = connect(mapStateToProps)(Workarea);

export default SmartWorkarea;
