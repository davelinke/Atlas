import CustomElement from './element.js'

const Css = `
:host{
    display: block;
}
button{
    background:none;
    padding:0.25em 0.5em;
    margin:0;
    border:none;
    font-size:1em;
    font-family:inherit;
    cursor:pointer;
    min-width:150px;
    width:100%;
    text-align:start;
    background-color:var(--menu-button-bg-color-idle, var(--element-highlight-color, #ffffff));
}
@media (hover: hover) {
    button:hover {
        background-color:var(--menu-button-bg-color-hover, var(--element-highlight-color, #f5f5f5));
    }
  }
`

class EditorMenuItem extends CustomElement {
  /**
     * the button constructor
     */
  constructor () {
    super()

    this.app = null

    // METHODS
    this._onClick = (e) => {
      this.dispatchEvent(new CustomEvent('editorMenuItemClick', {
        bubbles: true,
        composed: true
      }))
    }

    this.registerApp = (app) => {
      this.app = app
    }

    // attach shadow dom
    this._shadow = this.attachShadow({ mode: 'open' })

    this.setAttribute('role', 'menuitem')

    const styles = document.createElement('style')
    styles.innerHTML = Css
    this._shadow.appendChild(styles)

    this._button = document.createElement('button')
    this._button.addEventListener('click', this._onClick)

    this._shadow.appendChild(this._button)
  }

  connectedCallback () {
    this.dispatchEvent(new CustomEvent('editorMenuActivated', {
      detail: this,
      bubbles: true,
      composed: true
    }))
  }
}

export default EditorMenuItem
