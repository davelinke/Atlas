class EditorApp extends HTMLElement {

    /**
     * the button constructor
     */
    constructor() {
        super();

        // PROPS

        this.doc = null;

        this._zoomScale = 1;

        this.gridSize = 20;

        this.gridActive = true;

        this.workspace = null;

        this.toolDefault = 'rectangle';

        this.toolActive = null;


        Object.defineProperty(this, 'zoomScale', {
            get: () => {
                return this._zoomScale;
            },
            set: (val) => {
                if (val !== this._zoomScale) {
                    this._zoomScale = val;
                }
            }
        });

        // METHODS

        this.setModel = (key, value) => {
            this[key] = value;
            // broadcast model change event
            this.dispatchEvent(
                new CustomEvent(
                    'modelChange',
                    {
                        detail: { key: key, value: value },
                        bubbles: true,
                        composed: true
                    }
                )
            );
        }

        this.getWorkspace = () => {
            return this.workspace;
        }

        // EVENT LISTENERS

        // setting the model through bubbled events
        this.addEventListener('setModel', (e) => {
            this.setModel(e.detail.key, e.detail.value);
        });

        // what to do when the editor becomes available
        this.addEventListener('editorWorkspaceReady', (e) => {
            this.workspace = e.detail;
        });

        // what to do when tools become available
        this.addEventListener('toolReady', (e) => {
            if ((this.toolActive === null) && (this.toolDefault === e.detail.name)) {
                this.toolActive = e.detail;
                this.toolActive.activateTool(this);
            }
        });

        this.addEventListener('toolChange', (e) => {
            this.toolActive = e.detail;
            this.toolActive.activateTool(this);
        })

        // what to do when workspace starts input
        this.addEventListener('workspaceInputStart', (e) => {
            if (this.toolActive !== null) {
                console.log(this.toolActive)
                this.toolActive.inputStart(e);
            }
        });

        // what to do when workspace ends input
        this.addEventListener('workspaceInputEnd', (e) => {
            if (this.toolActive !== null) {
                this.toolActive.inputEnd(e);
            }
        });

        // what to do when workspace moves input
        this.addEventListener('workspaceInputMove', (e) => {
            if (this.toolActive !== null) {
                this.toolActive.inputMove(e);
            }
        });

        // what to do when workspace moves input
        this.addEventListener('setZoom', (e) => {
            this.zoomScale = e.detail;
            this.dispatchEvent(
                new CustomEvent(
                    'zoomChange',
                    {
                        detail: this.zoomScale,
                        bubbles: true,
                        composed: true
                    }
                )
            );
        });


        // THE DOM STRUCTURE

        // attach shadow dom
        this._shadow = this.attachShadow({ mode: 'open' });

        // create the html
        const slot = document.createElement('slot');
        this._shadow.append(slot);
    }

}

export default EditorApp;