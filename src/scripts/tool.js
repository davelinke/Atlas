import { fireEvent } from './lib-events.js'

const Css = `
button {
    display: inline-block;
    position: relative;
    width:42px;
    height:42px;
    background-color: var(--tool-button-color-idle, var(--cta-color-idle, transparent));
    border: none;
    border-radius: var(--tool-button-border-radius, var(--cta-border-radius, 3px));
    margin: 4px 0 4px 4px;
    cursor: pointer;
}
:host([active]) button {
    background-color: var(--tool-button-color-active, var(--cta-color-active, #f5f5f5));
}
button:focus,
:host([active]) button:focus {
    background-color: var(--tool-button-color-hover, var(--cta-color-hover, rgb(200,225,250)));
}
@media (hover: hover) {
    button:hover,
    :host([active]) button:hover{
        background-color: var(--tool-button-color-hover, var(--cta-color-hover, rgb(200,225,250)));
    }
}
::slotted(i){
    color: var(--tool-button-icon-color, var(--cta-icon-color, #444));
    font-size: var(--tool-button-icon-size, var(--cta-icon-size, 20px));
}
::slotted(.reflect){
    transform: scaleX(-1);
}
`

class Tool extends HTMLElement {
  constructor () {
    super()

    // PROPERTIES

    // METHODS

    this.activateTool = () => {
      const app = this.app
      // deactivate active sibling
      const activeSibling = this.parentNode.querySelector('[active]')
      if (activeSibling && activeSibling !== this) {
        activeSibling.deactivateTool(app)
      }
      this.setAttribute('active', 'true')

      if (this.toolInit) {
        this.toolInit(app)
      }
    }

    this.deactivateTool = (app) => {
      this.removeAttribute('active')

      if (this.toolDestroy) {
        this.toolDestroy(app)
      }
    }

    this.onHandShake = (app) => {
      this.app = app

      if ((app.toolActive === null) && (app.toolDefault === this.name)) {
        app.toolActive = this
        app.toolDefaultInstance = this
        this.activateTool()
      }

      this.onToolReady && this.onToolReady()
    }

    // attach shadow dom
    this._shadow = this.attachShadow({ mode: 'open' })

    const styles = document.createElement('style')
    styles.innerHTML = Css
    this._shadow.appendChild(styles)

    this._toolButton = document.createElement('button')
    this._toolButton.addEventListener('click', (e) => {
      // fire envent
      this.dispatchEvent(new CustomEvent('toolChange', { detail: this, bubbles: true, composed: true }))
    })

    const slot = document.createElement('slot')
    this._toolButton.append(slot)

    this._shadow.appendChild(this._toolButton)
  }

  // LIFECYCLE

  connectedCallback () {
    // fire up an event to make myself available to the app
    fireEvent(this, 'handShake', this)

    this.innerHTML = `<i class="${this.iconClass ? this.iconClass : ''}"></i>`
  }

  // ATTRIBUTE CHANGES
  static get observedAttributes () { return ['active'] }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'active') {
      if (newValue) {
        // activate tool
      } else {
        // deactivate tool
      }
    }
  }
}

export default Tool
