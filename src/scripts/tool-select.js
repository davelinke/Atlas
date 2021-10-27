import Tool from "./tool.js";

class ToolSelect extends Tool {

    constructor() {
        super();
        
        this.name = "select";
        this.icon = "near_me";
        this.iconClass = "reflect";
    }


}

export default ToolSelect;