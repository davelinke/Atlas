import Tool from "./tool.js";

class ToolSelect extends Tool {

    constructor() {
        super();
        
        this.name = "select";
        this.icon = "near_me";
        this.iconClass = "reflect";

        // METHODS

        this.toolInit = (app) => {
            // do stuff on initialization
            const ws = app.workspace;
            ws && ws.activateSelection();
        };
        this.toolDestroy = (app) => {
            // do stuff on destruction
        };
    }


}

export default ToolSelect;


