import React, { Component } from 'react';
import CoordFilters from '../factories/CoordFilters';
import store from '../store';
import Events from '../factories/Events';

import './Workarea.css';

const state = store.getState;

class Workarea extends Component {
    logEvent = function(e){
        //console.log(e.type);
        e.preventDefault();
        let
            //g = e.target,
            xy,
            xyo,
            eType = e.type
        ;
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
                x:e.offsetX,
                y:e.offsetY
            });
        }
        if(eType==='mousedown'||eType==='touchstart'){
            console.log('mousedown')
            store.dispatch({
                type: 'WORKAREA_CLASS',
                val:'mouse-down'
            });
            //disable undus till we mouseup
            store.dispatch({
                type: 'UNDO_DEACTIVATE'
            });
// blur inputs
//??$(':focus').blur();
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
//check what do we need so that we dont'save the full event
            // set the timeout for that will verify thel longpress
            store.dispatch({
                type:'MOUSE_LONGPRESS',
                val: self.setTimeout(function() {
                    // of we get here, the it's a longpress
                    Events.sendEvent({
                        theEvent:'longpress',
                        e:e
                    });
                    // clear the mousedown event (cause we just fired the longpress event)
                    store.dispatch({
                        type: 'MOUSE_IS_DOWN',
                        val: null
                    });
                },1000)
            });
        }

    }
    logMove = function(e){
        //console.log('move');
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
