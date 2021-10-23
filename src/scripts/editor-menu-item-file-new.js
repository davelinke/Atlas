import EditorMenuItem from "./editor-menu-item.js";

class EditorMenuItemFileNew extends EditorMenuItem {

    /**
     * the button constructor
     */
    constructor() {
        super();
        this._button.innerHTML = this.echo("New");
    }

}

export default EditorMenuItemFileNew;