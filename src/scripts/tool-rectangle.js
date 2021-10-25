import Tool from "./tool.js";

class ToolRectangle extends Tool {

    /**
     * the button constructor
     */
    constructor() {
        super();

        // PROPS
        this.name = 'rectangle';

        this.icon = 'crop_din';

        // METHODS

        this.toolInit = (app)=>{
            // do stuff on initialization
        };
        this.toolDestroy = (app)=>{
            // do stuff on destruction
        };
        this.inputStart = (e)=>{
            const ws = e.target;
            console.log(ws);
            ws.addElement();
            
        }
        this.inputEnd = (e)=>{
            //console.log('inputEnd',e);
        }
        this.inputMove = (e)=>{
            // console.log('inputMove',e);
        }
    }


}

export default ToolRectangle;