import React, { Component } from 'react';
import { connect } from 'react-redux';
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
			let toolFn = tools.set[tools.current][args.e.type];
			if (typeof(toolFn)==='function'){
				let currentPick = store.getState().pick;
				toolFn({
					pick: Object.assign(
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
		}
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
		// listen to keyboard
		this.listenToKeydown = function(event){
			// console.log('keydown',event);
			if (event.keyCode === 16){
				store.dispatch({
					type:'KEYBOARD_SHIFT',
					val:true
				});
			}
		};
		this.listenToKeyup = function(event){
			// console.log('keyup',event);
			if (event.keyCode === 16){
				store.dispatch({
					type:'KEYBOARD_SHIFT',
					val:false
				});
			}
		};
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
