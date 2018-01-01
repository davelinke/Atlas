import React, { Component } from 'react';
import { connect } from 'react-redux';
import {merge} from 'lodash';
import CoordFilters from '../../factories/CoordFilters';
import InputLogger from '../InputLogger/';
import store from '../../store'

import './styles.css';

class Workarea extends Component {
	constructor(props){
		super(props);
		this.pick = {
			add:function(elementObject){
				store.dispatch({
					type:'PICK_ADD',
					val:elementObject
				});
			},
			remove:function(elementId){
				store.dispatch({
					type:'PICK_REMOVE',
					val:elementId
				});
			},
			clear:function(){
				store.dispatch({
					type:'PICK_CLEAR'
				});
			}
		};
		this.eventReceptorFunction = function(args){
			store.dispatch({
				type: 'MOUSE_EVENT',
				val:args.e
			});
			let tools = this.props.tools;
			if (tools.current && (tools.set[tools.current]!==undefined)){
				let toolFn = tools.set[tools.current][args.e.type];
				if (typeof(toolFn)==='function'){
					let currentPick = store.getState().pick;
					toolFn({
						pick: merge(
							{},
							this.pick,
							{
								elements:currentPick.elements,
								initialStates:currentPick.initialStates
							}
						),
						event:args.e
						//keys:this.props.keyboard
					});
				}
			}
		}.bind(this);
		this.mouseDownFunction = function(e,xy){
			let screen = store.getState().screen;
			let so = screen.offset;
			let xyo = {
				x:(xy.x - (so.left*screen.zoom))/screen.zoom,
				y:(xy.y - (so.top*screen.zoom))/screen.zoom
			}
			xy = this.filterFunction(xy,e);
			xyo = this.filterFunction(xyo,e);
			//disable undus till we mouseup
			store.dispatch({
				type: 'UNDO_DEACTIVATE'
			});
			// blur inputs
			document.activeElement.blur();
			// register mousedown coordinates
			store.dispatch({
				type: 'MOUSE_DOWN',
				val:{
					down:{
						x:xy.x,
						y:xy.y
					},
					offsetDown:{
						x:xyo.x,
						y:xyo.y
					}
				}
			});
			store.dispatch({
				type:'WORKAREA_CLASS',
				val:['mouse-down']
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
		}
		this.mouseUpFunction = function(e,xy){
			let screen = store.getState().screen;
			let so = screen.offset;
			let xyo = {
				x:(xy.x - (so.left*screen.zoom))/screen.zoom,
				y:(xy.y - (so.top*screen.zoom))/screen.zoom
			}
			xy = this.filterFunction(xy,e);
			xyo = this.filterFunction(xyo, e);
			store.dispatch({
				type: 'WORKAREA_CLASS',
				val:[]
			});

			// enable undos
			store.dispatch({type: 'UNDO_ACTIVATE'});

			// if (History.checkTreeChange(state())!==undefined){
			//     History.undoLog(state());
			// }


			// register the coordinates

			store.dispatch({
				type:'MOUSE_UP',
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
		};
		this.registerMouseEventType = function(eType){
			store.dispatch({
				type:'MOUSE_EVENT',
				val:eType
			});
		};
		this.mouseMoveFunction = function(xy){
			let screen = this.props.screen;
			let so = screen.offset;
			let xyo = {
				x:(xy.x - (so.left*screen.zoom))/screen.zoom,
				y:(xy.y - (so.top*screen.zoom))/screen.zoom
			}
			xy = this.filterFunction(xy,{type:'mousemove'});
			xyo = this.filterFunction(xyo,{type:'mousemove'});
			store.dispatch({
				type:'MOUSE_POSITION',
				val:{
					x:xy.x,
					y:xy.y,
					offset:{
						x:xyo.x,
						y:xyo.y
					}
				}
			});
			store.dispatch({
				type:'WORKAREA_CLASS',
				val:['mouse-down','mouse-move']
			});
		}.bind(this);
		this.filterFunction = function(coords,e){
			return CoordFilters(coords,true,this.props.workarea,this.props.mouse,this.props.keyboard,this.props.screen,e);
		}.bind(this);
		// listen to keyboard
		this.listenToKeydown = function(event){
			let keyCode = event.keyCode;
			let keys = this.props.keyboard;
			if ((keys.set[keyCode]!==undefined)&&(keys.set[keyCode].keydown!==undefined)){
				keys.set[keyCode].keydown(event);
			}
			if (keyCode === 16){
				store.dispatch({
					type:'KEYBOARD_SHIFT',
					val:true
				});
			}
		}.bind(this);
		this.listenToKeyup = function(event){
			let keyCode = event.keyCode;
			let keys = this.props.keyboard;
			if ((keys.set[keyCode]!==undefined)&&(keys.set[keyCode].keyup!==undefined)){
				keys.set[keyCode].keyup(event);
			}
			if (event.keyCode === 16){
				store.dispatch({
					type:'KEYBOARD_SHIFT',
					val:false
				});
			}
		}.bind(this);
	}
	shouldComponentUpdate(nextProps, nextState) {
		return false; //gold
	}
	componentWillMount(){
		window.addEventListener("keydown", this.listenToKeydown, false);
		window.addEventListener("keyup", this.listenToKeyup, false);
	}
	componentWillUnmount() {
		window.removeEventListener("keydown", this.listenToKeydown, false);
		window.removeEventListener("keyup", this.listenToKeyup, false);
	}
	render() {
		return (
			<InputLogger
				zoom={this.props.screen.zoom}
				eventReceptorFunction={this.eventReceptorFunction}
				filterFunction={this.filterFunction}
				mouseDownFunction={this.mouseDownFunction}
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
	keyboard:store.keyboard,
	pick:store.pick
  };
}
const SmartWorkarea = connect(mapStateToProps)(Workarea);

export default SmartWorkarea;
