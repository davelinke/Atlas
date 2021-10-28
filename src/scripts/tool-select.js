import Tool from "./tool.js";

const CssPa = `
.editor-workspace-pa {
    border: 1px solid blue;
    position: absolute;
    z-index: 50000;
    pointer-events: none;
    box-sizing: border-box;
}
.editor-workspace-pa-handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background:#fff;
    border: 1px solid blue;
    box-sizing: border-box;
    box-shadow: 0px 1px 2px rgb(0 0 0 / 25%);
}
.editor-workspace-pa-handle.nw {
    top: -5px;
    left: -5px;
}
.editor-workspace-pa-handle.n {
    top: -5px;
    left: calc(50% - 5px);
}
.editor-workspace-pa-handle.ne {
    top: -5px;
    right: -5px;
}
.editor-workspace-pa-handle.e {
    top: calc(50% - 5px);
    right: -5px;
}
.editor-workspace-pa-handle.se {
    bottom: -5px;
    right: -5px;
}
.editor-workspace-pa-handle.s {
    bottom: -5px;
    left: calc(50% - 5px);
}
.editor-workspace-pa-handle.sw {
    bottom: -5px;
    left: -5px;
}
.editor-workspace-pa-handle.w {
    top: calc(50% - 5px);
    left: -5px;
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

        // METHODS

        // lets return the specific element that was clicked
        this.getCompElement = (path) => {
            for (let element of path) {
                console.log(element.tagName, element.tagName === 'EDITOR-ELEMENT');
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
        }
        this.deselectAll = () => {
            console.log('deselecting all');
            for (let element of this.pick) {
                element.picked = false;
            }
            this.pick = [];
            this.pickAreaElement.style.opacity = 0;

        }

        // keeping all modifier tasks inside an object
        this.modTasks = {};

        // the mod task for moving objects
        this.modTasks['mod'] = (element, e) => {
            const currentX = parseInt(element.style.left.replace('px', ''), 10);
            const currentY = parseInt(element.style.top.replace('px', ''), 10);
            const newX = currentX + (e.detail.mouseEvent.movementX / this.appReference.zoomScale);
            const newY = currentY + (e.detail.mouseEvent.movementY / this.appReference.zoomScale);
            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
        }

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
            this.pickAreaElement.appendChild(this.paNW);

            this.paN = document.createElement('div');
            this.paN.setAttribute('class', 'editor-workspace-pa-handle n');
            this.pickAreaElement.appendChild(this.paN);

            this.paNE = document.createElement('div');
            this.paNE.setAttribute('class', 'editor-workspace-pa-handle ne');
            this.pickAreaElement.appendChild(this.paNE);

            this.paW = document.createElement('div');
            this.paW.setAttribute('class', 'editor-workspace-pa-handle w');
            this.pickAreaElement.appendChild(this.paW);

            this.paE = document.createElement('div');
            this.paE.setAttribute('class', 'editor-workspace-pa-handle e');
            this.pickAreaElement.appendChild(this.paE);

            this.paSW = document.createElement('div');
            this.paSW.setAttribute('class', 'editor-workspace-pa-handle sw');
            this.pickAreaElement.appendChild(this.paSW);

            this.paS = document.createElement('div');
            this.paS.setAttribute('class', 'editor-workspace-pa-handle s');
            this.pickAreaElement.appendChild(this.paS);

            this.paSE = document.createElement('div');
            this.paSE.setAttribute('class', 'editor-workspace-pa-handle se');
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

            this.pick.forEach((element) => {
                this.modTasks[this.modTask](element, e);
            })
            this.modTasks[this.modTask](this.pickAreaElement, e);
        }
        this.inputEnd = (e) => {
            if (this.pick.length > 0) {
                this.pickAreaElement.style.opacity = 1;
                this.pickAreaHidden = false;
            }
        }
    }


}

export default ToolSelect;


