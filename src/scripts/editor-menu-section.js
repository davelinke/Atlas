import CustomElement from "./element.js";

const Css = `
:host{
    display:inline-block;
    position:relative;
}
button{
    background:none;
    padding:0.25em 0.5em;
    margin:0;
    border:none;
    font-size:1em;
    font-family:inherit;
    cursor:pointer;
}
:host([open="true"]) button{
    background-color:var(--menu-button-bg-color-open, var(--element-highlight-color, #f5f5f5));
}
.layer{
    background-color: #f0f0f0;
    opacity:0;
    pointer-events:none;
    position:absolute;
    box-shadow: 0px 3px 4px rgba(0,0,0,0.25);
}
:host([open="true"]) .layer{
    opacity:1;
    pointer-events:auto;
}
`;

class EditorMenuSection extends CustomElement {

    

    /**
     * workspace attributes to be observed 
     */
    // static get observedAttributes() { return ['variant', 'href', 'target', 'disabled', 'elevation'] }

    /**
     * the button constructor
     */
    constructor() {
        super();

        //METHODS

        this.open = () => {
            this.setAttribute('open', 'true');
            this.setAttribute('aria-expanded', 'true');

            const event = new CustomEvent('editorMenuOpen', {
                bubbles: true
            });
            this.dispatchEvent(event);
        }

        this.close = () => {
            this.removeAttribute('open');
            this.setAttribute('aria-expanded', 'false');

            const event = new CustomEvent('editorMenuClose', {
                bubbles: true
            });
            this.dispatchEvent(event);
        }

        this._buttonClick = () => {
            const isOpen = this.hasAttribute('open');
            if (isOpen) {
                this.close();
            } else {
                this.open();
            }
        };

        //EVENT LISTENERS

        // close menu if another has been opened
        this.parentElement.addEventListener('editorMenuOpen', (e) => {
            if (e.target !== this) {
                this.close();
            }
        });

        // close menu if an inner element has been clicked
        this.addEventListener('editorMenuItemClick', () => {
            if (this.getAttribute('open') === 'true') {
                this.close()
            }
        });

        // close menu on click outside
        document.addEventListener('click', (e) => {
            if ((this.getAttribute('open') === 'true') && !this.contains(e.target)) {
                this.close()
            }
        });

        // CREATE ELEMENTS

        this._shadow = this.attachShadow({ mode: 'open' });

        this.setAttribute('role', 'menu');

        const styles = document.createElement('style');
        styles.innerHTML = Css;
        this._shadow.appendChild(styles);

        const button = document.createElement('button');
        button.innerText = this.echo(this.getAttribute('label'));
        button.addEventListener('click', this._buttonClick);

        this._shadow.append(button);

        this._layer = document.createElement('div');
        this._layer.classList.add('layer');
        // create the html
        const slot = document.createElement('slot');
        this._layer.append(slot);

        this._shadow.append(this._layer);

    }

}

export default EditorMenuSection;