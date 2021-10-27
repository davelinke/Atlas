class EditorElement extends HTMLElement {

    /**
     * the button constructor
     */
    constructor() {
        super();

        // attach shadow dom
        this._shadow = this.attachShadow({ mode: 'open' });

        // create the html
        const slot = document.createElement('slot');
        this._shadow.append(slot);
    }

}

export default EditorElement;