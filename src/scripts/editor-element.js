import { propUnitsJs } from './lib-units.js'

/**
 * THE CSS FOR THE ELEMENTS
 */
const Css = `
:host {
    user-select: none;
    box-sizing: border-box;
    
    outline: 1px solid transparent;
    -webkit-backface-visibility: hidden;
}

.mod {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: -1px;
    
    outline: 1px solid transparent;
    -webkit-backface-visibility: hidden;
}

.mod:hover {
    border: 1px solid var(--editor-element-border-hover-color, blue);
}

:host(.picked) .mod{
    border: 1px solid var(--editor-element-border-picked-color, blue);
}
`

class EditorElement extends HTMLElement {
  constructor () {
    super()

    /**
     * THE APP ELEMENT STATE
     */

    // is in the pick?
    this._picked = false

    // the various visual states defined by css properties
    this.states = {}

    // the current visual state
    this.currentState = 'default'

    /**
     * THE ELEMENT PROPERTIES
     */

    /**
     * Is it picked?
     */
    Object.defineProperty(this, 'picked', {
      get: () => {
        return this._picked
      },
      set: (val) => {
        this._picked = !!val
        const classListFn = this._picked ? 'add' : 'remove'
        this.classList[classListFn]('picked')
      }
    })

    /**
     * THE ELEMENT METHODS
     */

    /**
     * A method to set the current visual state
     */
    this.setState = (state, props) => {
      this.states[state] = props
      this.setAttribute(`data-states-${state}`, JSON.stringify(props))
    }

    /**
     * A method to set the element name
     */
    this.setName = (name) => {
      this.setAttribute('data-name', name)
    }

    /**
     * A method to set what kind of element is this (box, text, image, etc)
     */
    this.setType = (type) => {
      this.setAttribute('data-type', type)
    }

    /**
     * A method that returns the element dimensions
     */
    this.getDimensions = () => {
      return this.states[this.currentState]
    }

    /**
     * A method to set a visual property to the current state of the element
     */
    this.setProp = (prop, value) => {
      this.states[this.currentState][prop] = value
      this.setAttribute(`data-states-${this.currentState}`, JSON.stringify(this.states[this.currentState]))
      const units = propUnitsJs[prop] ? propUnitsJs[prop] : ''
      this.style[prop] = value + units
    }

    /**
     * LET'S ADD TO THE DOM/SHADOW DOM
     */

    this._shadow = this.attachShadow({ mode: 'open' })

    // add the styles
    const styles = document.createElement('style')
    styles.innerHTML = Css
    this._shadow.appendChild(styles)

    // create the html
    const slot = document.createElement('slot')
    this._shadow.append(slot)

    this.modGrid = document.createElement('div')
    this.modGrid.classList.add('mod')

    this._shadow.append(this.modGrid)
  }

  /**
   * A method to execute when we insert in the DOM
   */
  connectedCallback () {
    /**
     * since we hold the states in the element's data attributes
     * so we can serialize and store them as text
     * we need to deserialize them and store them in the states object
     */
    for (const [key, value] of Object.entries(this.dataset)) {
      const regex = new RegExp('states*')
      if (regex.test(key)) {
        const statename = key.replace('states', '').toLowerCase()
        const props = JSON.parse(value)
        this.setState(statename, props)
      }
    }
  }
}

export default EditorElement
