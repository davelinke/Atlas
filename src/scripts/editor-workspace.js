class EditorWorkspace extends HTMLElement {

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

        const theDiv = document.createElement('div');
        theDiv.innerHTML = `Hello World`;

        this._shadow.append(theDiv);
    }

}

export default EditorWorkspace;