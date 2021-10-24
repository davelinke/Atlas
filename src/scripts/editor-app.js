class EditorApp extends HTMLElement {

    /**
     * the button constructor
     */
    constructor() {
        super();

        this.model = {
            doc: null,
            tools: null,
            activeTool: null,
            baseElementStyle: null,
            zoomScale: 1,
            activeElement: null,
            gridActive: true,
            gridSize: 20
        }

        this.setModel = (key, value)=>{
            const modelCopy = Object.assign({}, this.model);
            modelCopy[key] = value;
            this.model = modelCopy;
            // broadcast model change event
            this.dispatchEvent(new CustomEvent('modelChange', {detail: this.model}));
        }

        this.addEventListener('setModel', (e)=>{
            this.setModel(e.detail.key, e.detail.value);
        });

        // attach shadow dom
        this._shadow = this.attachShadow({ mode: 'open' });

        this.setAttribute('role', 'menubar');

        // create the html
        const slot = document.createElement('slot');
        this._shadow.append(slot);
    }

}

export default EditorApp;