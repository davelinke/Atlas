import EditorMenuItem from "./editor-menu-item.js";

class EditorMenuItemFileNew extends EditorMenuItem {

    /**
     * the button constructor
     */
    constructor() {
        super();

        this._button.innerHTML = "New";
    }

}

export default EditorMenuItemFileNew;