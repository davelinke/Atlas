import React, { Component } from 'react';
import { connect } from 'react-redux';
import CoordFilters from '../factories/CoordFilters';
//import Events from '../factories/Events';
import InputLogger from './InputLogger';
import store from '../store'

import './Workarea.css';

class Workarea extends Component {
	constructor(props){
		super(props);
		this.pick = {
			add:function(elementId){
				store.dispatch({
					type:'PICK_ADD',
					val:elementId
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
			let toolFn = tools.set[tools.current][args.e.type];

			if (typeof(toolFn)==='function'){
				toolFn({
					pick:this.pick,
					keys:this.props.keyboard,
					event:args.e
				});
			}
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
		};
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
		};
		this.registerMouseEventType = function(eType){
			store.dispatch({
				type:'MOUSE_EVENT',
				val:eType
			});
		};
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
		this.filterFunction = function(coords){
			return CoordFilters(coords,true,this.props.workarea,this.props.mouse,this.props.keyboard);
		}.bind(this);
	}
	shouldComponentUpdate(nextProps, nextState) {
		return false; //gold
	}
	render() {
		console.log('workarea rendering')
		return (
			<InputLogger
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
