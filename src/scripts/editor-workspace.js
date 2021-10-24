const viewportDim = 10000;

const Css = `
:host{
    display:block;
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    overflow:hidden;
}

.wrapper{
    width: 100%; 
    height: 100%; 
    overflow: auto;
}

.workspace{
    width:${viewportDim}px;
    height:${viewportDim}px;
    background-color: var(--workspace-bckground-color, #f9f9f9);
    position:relative;
}
`;

class EditorWorkspace extends HTMLElement {

    /**
     * the button constructor
     */
    constructor() {
        super();

        // find the app
        const app = this.closest('editor-app');

        // listen for model changes and update local state
        app.addEventListener('modelChange', (e) => {
            console.log('model-change')
            this.zoomScale = e.detail.zoomScale;
        });

        this._zoomScale = 1;
        Object.defineProperty(this, 'zoomScale', {
            get: () => {
                return this._zoomScale;
            },
            set: (val) => {
                if (val !== this._zoomScale) {
                    this._zoomScale = val;
                    this._workspace.style.transform = `scale(${val})`;
                }
            }
        });

        // attach shadow dom
        this._shadow = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('style');
        styles.innerHTML = Css;
        this._shadow.appendChild(styles);

        this._wrapper = document.createElement('div');
        this._wrapper.classList.add('wrapper');
        this._shadow.append(this._wrapper);

        this._workspace = document.createElement('div');
        this._workspace.classList.add('workspace');
        this._workspace.style.transform = `scale(${this.zoomScale})`;
        this._workspace.innerHTML = '<div style="position:absolute; background:#fff; border:1px solid #000; top:4750px; left:4840px; width:300px; height:500px"></div>'

        this._wrapper.append(this._workspace);
    }


    connectedCallback() {
        // scroll to middle if it's not defined
        this._wrapper.scrollLeft = ((viewportDim/2) - (this.getBoundingClientRect().width / 2));
        this._wrapper.scrollTop = ((viewportDim/2) - (this.getBoundingClientRect().height / 2));
    }

}

export default EditorWorkspace;