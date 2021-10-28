import Tool from "./tool.js";

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

        // METHODS

        // lets return the specific element that was clicked
        this.getCompElement = (path) => {
            for (let element of path) {
                console.log(element.tagName, element.tagName==='EDITOR-ELEMENT');
                if (element.tagName && (element.tagName==='EDITOR-ELEMENT')) {
                    return element;
                }
            }

            return null
        };

        // returns the class of the modifier in use
        this.getModTask = (path) => {
            return path[0].classList[0];
        }

        // defines if an element should be added or not to the elements being modified
        this.pickRegister = (element) => {
            if (element.picked) {
                if (this.isAdding) {
                    element.picked = false;
                    this.pick.splice(this.pick.indexOf(element), 1);
                }
            } else {
                if (!this.isAdding) {
                    this.deselectAll();
                }

                element.picked = true;
                this.pick.push(element);
            }
        }
        this.deselectAll = () => {
            for (let element of this.pick) {
                element.picked = false;
            }
            this.pick = [];
        }

        // keeping all modifier tasks inside an object
        this.modTasks = {};

        // the mod task for moving objects
        this.modTasks['mod__move'] = (element,e) => {
                const currentX = parseInt(element.style.left.replace('px', ''));
                const currentY = parseInt(element.style.top.replace('px', ''));
                const newX = currentX + e.detail.mouseEvent.movementX;
                const newY = currentY + e.detail.mouseEvent.movementY;
                console.log(newX, newY);
                element.style.left = newX + 'px';
                element.style.top = newY + 'px';
        }

        this.toolInit = (app) => {
            // do stuff on initialization
            const ws = app.workspace;
            ws && ws.activateSelection();
        };
        this.toolDestroy = (app) => {
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

            if (shiftKey) {
                this.constrainAngle = true;
            } else {
                this.constrainAngle = false;
            }

            this.pick.forEach((element) => {
                this.modTasks[this.modTask](element,e);
            })
        }
        this.inputEnd = (e) => {
        }
    }


}

export default ToolSelect;


