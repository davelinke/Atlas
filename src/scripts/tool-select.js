import Tool from "./tool.js";
import { coordsFilterFn } from './lib-filters.js'

const CssPa = `
.editor-workspace-pa {
    border: 1px solid blue;
    position: absolute;
    z-index: 50000;
    pointer-events: none;
    box-sizing: border-box;
    
    outline: 1px solid transparent;
    -webkit-backface-visibility: hidden;
}
.editor-workspace-pa-handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background:#fff;
    border: 1px solid blue;
    box-sizing: border-box;
    box-shadow: 0px 1px 2px rgb(0 0 0 / 25%);
    pointer-events: all;
}
.editor-workspace-pa-handle.nw {
    top: -5px;
    left: -5px;
    cursor: nwse-resize;
}
.editor-workspace-pa-handle.n {
    top: -5px;
    left: calc(50% - 5px);
    cursor: ns-resize;
}
.editor-workspace-pa-handle.ne {
    top: -5px;
    right: -5px;
    cursor: nesw-resize;
}
.editor-workspace-pa-handle.e {
    top: calc(50% - 5px);
    right: -5px;
    cursor: ew-resize;
}
.editor-workspace-pa-handle.se {
    bottom: -5px;
    right: -5px;
    cursor: nwse-resize;
}
.editor-workspace-pa-handle.s {
    bottom: -5px;
    left: calc(50% - 5px);
    cursor: ns-resize;
}
.editor-workspace-pa-handle.sw {
    bottom: -5px;
    left: -5px;
    cursor: nesw-resize;
}
.editor-workspace-pa-handle.w {
    top: calc(50% - 5px);
    left: -5px;
    cursor: ew-resize;
}
`;

class ToolSelect extends Tool {

    constructor() {
        super();

        this.name = "select";
        this.icon = "near_me";
        this.iconClass = "reflect";

        this.isAdding = false;
        this.isCopying = false;
        this.constrainAngle = false;

        this.pick = [];

        this.pickAreaElement = null;
        this.pickAreaHidden = false;

        this.appReference = null;
        this.pickStart = null;

        // METHODS

        // lets return the specific element that was clicked
        this.getCompElement = (path) => {
            for (let element of path) {
                if (element.tagName && (element.tagName === 'EDITOR-ELEMENT')) {
                    return element;
                }
            }

            return null
        };

        // returns the class of the modifier in use
        this.getModTask = (path) => {
            return path[0].classList[0];
        }

        this.resizePickArea = () => {
            let lowestX = null;
            let lowestY = null;
            let highestX = null;
            let highestY = null;
            this.pick.forEach(element => {
                const x = parseInt(element.style.left.replace('px', ''), 10);
                const y = parseInt(element.style.top.replace('px', ''), 10);

                const xw = x + element.offsetWidth;
                const yh = y + element.offsetHeight;


                if (lowestX === null || x < lowestX) {
                    lowestX = x;
                }
                if (lowestY === null || y < lowestY) {
                    lowestY = y;
                }
                if (highestX === null || xw > highestX) {
                    highestX = xw;
                }
                if (highestY === null || yh > highestY) {
                    highestY = yh;
                }

            });

            this.pickAreaElement.style.left = lowestX + 'px';
            this.pickAreaElement.style.top = lowestY + 'px';
            this.pickAreaElement.style.width = (highestX - lowestX) + 'px';
            this.pickAreaElement.style.height = (highestY - lowestY) + 'px';
        }

        this.addToPick = (element) => {
            element.picked = true;
            this.pick.push(element);
            this.resizePickArea();
        }

        this.removeFormPick = (element) => {
            element.picked = false;
            this.pick.splice(this.pick.indexOf(element), 1);
            this.resizePickArea();
        }

        // defines if an element should be added or not to the elements being modified
        this.pickRegister = (element) => {
            if (element.picked) {
                if (this.isAdding) {
                    this.removeFormPick(element);
                }
            } else {
                // if no shift key is pressed, clear the pick
                if (!this.isAdding) {
                    this.deselectAll();
                }
                // and add the element to the pick
                this.addToPick(element);
            }
            this.pickStart = this.pick.map((element) => {
                return {
                    left: parseInt(element.style.left.replace('px', ''), 10),
                    top: parseInt(element.style.top.replace('px', ''), 10),
                    width: element.offsetWidth,
                    height: element.offsetHeight
                }
            });
        }
        this.deselectAll = () => {
            for (let element of this.pick) {
                element.picked = false;
            }
            this.pick = [];
            this.pickAreaElement.style.opacity = 0;

        }

        // keeping all modifier tasks inside an object
        this.modTasks = {};

        // the mod task for moving objects
        this.modTasks['mod'] = (element, i, e) => {
            // const zoomedDelta = {
            //     x: e.detail.delta.x,
            //     y: e.detail.delta.y
            // }

            // const newX = this.pickStart[i].left + zoomedDelta.x;
            // const newY = this.pickStart[i].top + zoomedDelta.y;

            // element.style.left = newX + 'px';
            // element.style.top = newY + 'px';
        }

        this.startResize = (e) => {
            // prevent the propagation of the event
            console.log('hello')
            e.preventDefault();
            e.stopPropagation();

            // flag that we are resizing
            this.resizing = true;

            // find out the orientations of the resize
            this.resizeV = e.target.dataset.resizeV ? e.target.dataset.resizeV : false;
            this.resizeH = e.target.dataset.resizeH ? e.target.dataset.resizeH : false;

            // save the coords of the down event
            this.resizeDownCoords = {
                x: e.clientX,
                y: e.clientY
            };

            // calculate and store the dimensions of the resizing area at the beginning
            const areaStart = {
                left: parseInt(this.pickAreaElement.style.left.replace('px', ''), 10),
                top: parseInt(this.pickAreaElement.style.top.replace('px', ''), 10),
                right: parseInt(this.pickAreaElement.style.right.replace('px', ''), 10),
                bottom: parseInt(this.pickAreaElement.style.bottom.replace('px', ''), 10)
            }

            // save the dimensions of the elements to be resized in the beginning
            const pickStart = this.pick.map((element) => {
                return {
                    left: parseInt(element.style.left.replace('px', ''), 10),
                    top: parseInt(element.style.top.replace('px', ''), 10),
                    right: parseInt(element.style.right.replace('px', ''), 10),
                    bottom: parseInt(element.style.bottom.replace('px', ''), 10)
                }
            });

            // a function for resizing forwards (when locked side is either left or top)
            const resizeFw = (o, proportions) => {
                const dims = {
                    y: {
                        start: 'top',
                        end: 'bottom'
                    },
                    x: {
                        start: 'left',
                        end: 'right'
                    }
                }

                const start = dims[o].start;
                const mag = dims[o].mag;

                // i obtain the new area width calculatinng the initial width
                // multiplied by the new proportion of the x axis
                const newAreaMag = Math.round(
                    (
                        areaStart[mag] * proportions[o]

                    ) * 10) / 10;

                // with this information i can calculate teh new left and widths of all the elements
                this.pick.forEach((element, i) => {
                    // width of the pick equals the 100% of the transformation
                    // i got to calculate my initial position translated to a percentage (multiple) of the 100%
                    const pctStart = ((pickStart[i][start] - areaStart[start]) * 1) / areaStart[mag];
                    // then i get the new area width
                    // and since i know the multiple of my starting position before the resize
                    // i can calculate the new position of the element
                    const newStart = Math.floor(areaStart[start] + (newAreaMag * pctStart));

                    // then i set the new styles of the elements
                    element.style[start] = newStart + 'px';
                    element.style[mag] = Math.ceil(pickStart[i][mag] * proportions[o]) + 'px';
                });

                // and of course we need to update the width of the pick area
                this.pickAreaElement.style[mag] = Math.ceil(newAreaMag) + 'px';

            }

            const resizeBw = (o, proportions) => {
                const dims = {
                    y: {
                        start: 'top',
                        mag: 'height'
                    },
                    x: {
                        start: 'left',
                        mag: 'width'
                    }
                }

                const start = dims[o].start;
                const mag = dims[o].mag;

                // i obtain the new area width calculatinng the initial width
                // multiplied by the new proportion of the x axis
                const newAreaMag = Math.round(
                    (
                        areaStart[mag] * proportions[o]

                    ) * 10) / 10;


                const newAreaStart = areaStart[start] + (areaStart[mag] - newAreaMag);

                // with this information i can calculate teh new left and widths of all the elements
                this.pick.forEach((element, i) => {
                    // width of the pick equals the 100% of the transformation
                    // i got to calculate my initial position translated to a percentage (multiple) of the 100%
                    const pctStart = (pickStart[i][start] - areaStart[start]) / areaStart[mag];
                    // then i get the new area width
                    // and since i know the multiple of my starting position before the resize
                    // i can calculate the new position of the element
                    const newStart = Math.floor(

                        newAreaStart + (newAreaMag * pctStart)

                    );

                    // then i set the new styles of the elements
                    element.style[start] = newStart + 'px';
                    element.style[mag] = Math.ceil(pickStart[i][mag] * proportions[o]) + 'px';
                });

                // and of course we need to update the width of the pick area
                this.pickAreaElement.style[mag] = Math.ceil(newAreaMag) + 'px';
                this.pickAreaElement.style[start] = newAreaStart + 'px';

            }


            // an object that determines which functions to use depending on the orientations of the resize
            const resizeFunctions = {
                n: (e, proportions) => {
                    resizeBw('y', proportions);
                }
                , e: (e, proportions) => {
                    resizeFw('x', proportions);
                }
                , s: (e, proportions) => {
                    resizeFw('y', proportions);
                }
                , w: (e, proportions) => {
                    resizeBw('x', proportions);
                }
            }

            // the resizing function when the mouse is moving
            const resize = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const zoomScale = this.appReference.zoomScale;

                const proportions = {
                    x: null,
                    y: null
                }

                const filteredCoords = coordsFilterFn({left:e.clientX, top:e.clientY}, this.appReference.gridActive, this.appReference.gridSize, this.appReference.zoomScale, false);

                if (this.resizeV === 's') {
                    const asEnd = this.appReference.workspace.viewportDim - areaStart.bottom;
                    const asHeight = asEnd - areaStart.top;
                    proportions.y = (
                        asHeight +
                        ((filteredCoords.top - this.resizeDownCoords.y) / zoomScale)
                    ) / asHeight;
                }
                if (this.resizeV === 'n') {
                    const asEnd = this.appReference.workspace.viewportDim - areaStart.bottom;
                    const asHeight = asEnd - areaStart.top;
                    proportions.y = (
                        asHeight -
                        ((filteredCoords.left - this.resizeDownCoords.y) / zoomScale)
                    ) / asHeight;
                }

                if (this.resizeH === 'e') {
                    proportions.x = (
                        areaStart.width +
                        ((filteredCoords.left - this.resizeDownCoords.x) / zoomScale)
                    ) / areaStart.width;
                }
                if (this.resizeH === 'w') {
                    proportions.x = (
                        areaStart.width -
                        ((filteredCoords.left - this.resizeDownCoords.x) / zoomScale)
                    ) / areaStart.width;
                }

                this.resizeV && resizeFunctions[this.resizeV](e, proportions);
                this.resizeH && resizeFunctions[this.resizeH](e, proportions);
            }

            // the stop resize function that clears event listeners and resets the flags
            const stopResize = (e) => {
                e.preventDefault();
                e.stopPropagation();

                this.resizing = false;
                this.resizeV = null;
                this.resizeH = null;
                this.resizeDownCoords = null;
                document.removeEventListener('mousemove', resize);
                document.removeEventListener('touchmove', resize);
                document.removeEventListener('mouseup', stopResize);
                document.removeEventListener('touchend', stopResize);
            }

            // the event listerners for the subsequent move and mouseup events
            document.addEventListener('mouseup', stopResize);
            document.addEventListener('touchend', stopResize);
            document.addEventListener('mousemove', resize);
            document.addEventListener('touchmove', resize);
        }

        this.resize = (e, dir) => { }

        this.toolInit = (app) => {
            // do stuff on initialization
            const ws = app.workspace;
            this.appReference = app;

            // create the pick area
            this.pickAreaElement = document.createElement('div');
            this.pickAreaElement.classList.add('editor-workspace-pa');

            const paStyles = document.createElement('style');
            paStyles.innerHTML = CssPa;
            this.pickAreaElement.appendChild(paStyles);

            this.paNW = document.createElement('div');
            this.paNW.setAttribute('class', 'editor-workspace-pa-handle nw');
            this.paNW.dataset.resizeV = 'n';
            this.paNW.dataset.resizeH = 'w';
            this.paNW.addEventListener('mousedown', this.startResize);
            this.pickAreaElement.appendChild(this.paNW);

            this.paN = document.createElement('div');
            this.paN.setAttribute('class', 'editor-workspace-pa-handle n');
            this.paN.dataset.resizeV = 'n';
            this.paN.addEventListener('mousedown', this.startResize);
            this.pickAreaElement.appendChild(this.paN);

            this.paNE = document.createElement('div');
            this.paNE.setAttribute('class', 'editor-workspace-pa-handle ne');
            this.paNE.dataset.resizeV = 'n';
            this.paNE.dataset.resizeH = 'e';
            this.paNE.addEventListener('mousedown', this.startResize);
            this.pickAreaElement.appendChild(this.paNE);

            this.paW = document.createElement('div');
            this.paW.setAttribute('class', 'editor-workspace-pa-handle w');
            this.paW.dataset.resizeH = 'w';
            this.paW.addEventListener('mousedown', this.startResize);
            this.pickAreaElement.appendChild(this.paW);

            this.paE = document.createElement('div');
            this.paE.setAttribute('class', 'editor-workspace-pa-handle e');
            this.paE.dataset.resizeH = 'e';
            this.paE.addEventListener('mousedown', this.startResize);
            this.pickAreaElement.appendChild(this.paE);

            this.paSW = document.createElement('div');
            this.paSW.setAttribute('class', 'editor-workspace-pa-handle sw');
            this.paSW.dataset.resizeV = 's';
            this.paSW.dataset.resizeH = 'w';
            this.paSW.addEventListener('mousedown', this.startResize);
            this.pickAreaElement.appendChild(this.paSW);

            this.paS = document.createElement('div');
            this.paS.setAttribute('class', 'editor-workspace-pa-handle s');
            this.paS.dataset.resizeV = 's';
            this.paS.addEventListener('mousedown', this.startResize);
            this.pickAreaElement.appendChild(this.paS);

            this.paSE = document.createElement('div');
            this.paSE.setAttribute('class', 'editor-workspace-pa-handle se');
            this.paSE.dataset.resizeV = 's';
            this.paSE.dataset.resizeH = 'e';
            this.paSE.addEventListener('mousedown', this.startResize);
            this.pickAreaElement.appendChild(this.paSE);


            ws._canvas.appendChild(this.pickAreaElement);

            ws && ws.activateSelection();
        };
        this.toolDestroy = (app) => {
            const ws = app.workspace;
            ws._canvas.removeChild(this.pickAreaElement);
            this.pickAreaElement = null;
            // do stuff on destruction
        };
        this.inputStart = (e) => {
            const element = this.getCompElement(e.detail.mouseEvent.path);
            const shiftKey = e.detail.mouseEvent.shiftKey;
            const ctrlKey = e.detail.mouseEvent.ctrlKey;
            const altKey = e.detail.mouseEvent.altKey;

            this.modTask = this.getModTask(e.detail.mouseEvent.path);

            if (shiftKey) {
                this.isAdding = true;
                if (element) {
                    this.pickRegister(element);
                }
            } else {
                this.isAdding = false;
                if (element) {
                    this.pickRegister(element);
                } else {
                    this.deselectAll();
                }
            }
        }
        this.inputMove = (e) => {
            const shiftKey = e.detail.mouseEvent.shiftKey;
            const ctrlKey = e.detail.mouseEvent.ctrlKey;
            const altKey = e.detail.mouseEvent.altKey;
            if (!this.pickAreaHidden) {
                this.pickAreaElement.style.opacity = 0;
            }

            if (shiftKey) {
                this.constrainAngle = true;
            } else {
                this.constrainAngle = false;
            }

            this.pick.forEach((element, i) => {
                this.modTasks[this.modTask](element, i, e);
            })
            this.resizePickArea();
        }
        this.inputEnd = (e) => {
            this.moveIncrementX = null;
            this.moveIncrementY = null;

            if (this.pick.length > 0) {
                this.pickAreaElement.style.opacity = 1;
                this.pickAreaHidden = false;
            }
        }
    }


}

export default ToolSelect;


