import store from '../store';

const state = store.getState;

export default (coords, wc=true) => {
    let finalCoords = coords;

    //filter all you want
    if (state().workarea.snapToGrid){
        let gridMultiple = function(num,multiple){
			return Math.round(num / multiple) * multiple;
		};
		finalCoords = {
			x:gridMultiple(coords.x, state().workarea.gridSize),
			y:gridMultiple(coords.y, state().workarea.gridSize)
		};
    }
    if(state().keyboard.shift && wc){
        let dd = {
			x:finalCoords.x - state().mouse.down.x,
			y:finalCoords.y - state().mouse.down.y
		};
		let angle = -1 * Math.atan2(dd.y, dd.x) * 180 / Math.PI;
		angle = Math.floor(angle < 0 ? 360 + angle : angle);
		let quadrant = Math.floor((angle-15)/45);
		let lower;
		switch(quadrant){
			case 0: //(45deg)
				lower = dd.x<Math.abs(dd.y)?dd.x:Math.abs(dd.y);
				finalCoords = {
					x:state().mouse.down.x + lower,
					y:state().mouse.down.y - lower
				};
				break;
			case 2: //135
				lower = dd.x>dd.y?dd.x:dd.y;
				finalCoords = {
					x:state().mouse.down.x + lower,
					y:state().mouse.down.y + lower
				};
				break;
			case 4: //225
				lower = Math.abs(dd.x)<dd.y?Math.abs(dd.x):dd.y;
				finalCoords = {
					x:state().mouse.down.x - lower,
					y:state().mouse.down.y + lower
				};
				break;
			case 6: //305
				lower = dd.x<dd.y?dd.x:dd.y;
				finalCoords = {
					x:state().mouse.down.x + lower,
					y:state().mouse.down.y + lower
				};
				break;
			case 1: //(90)
			case 5: //270px
				finalCoords = {
					x: state().mouse.down.x,
					y:finalCoords.y
				};
				break;
			default: //(-1 and 7 and 3)
				finalCoords = {
					x: finalCoords.x,
					y: state().mouse.down.y
				};
		}
	}
    return finalCoords;
};
