import { propUnitsJs } from './lib-units.js'

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
  /**
     * the button constructor
     */
  constructor () {
    super()

    // STATE

    this._picked = false

    this.states = {}

    this.currentState = 'default'

    // PROPS
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

    // METHODS

    this.setState = (state, props) => {
      this.states[state] = props
      this.setAttribute(`data-states-${state}`, JSON.stringify(props))
    }

    this.getDimensions = () => {
      return this.states[this.currentState]
    }

    this.setProp = (prop, value) => {
      this.states[this.currentState][prop] = value
      this.setAttribute(`data-states-${this.currentState}`, JSON.stringify(this.states[this.currentState]))
      this.style[prop] = value + propUnitsJs[prop]
    }

    // attach shadow dom
    this._shadow = this.attachShadow({ mode: 'open' })

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

  connectedCallback () {
    for (const [key, value] of Object.entries(this.dataset)) {
      const statename = key.replace('states', '').toLowerCase()
      const props = JSON.parse(value)
      this.setState(statename, props)
    }
  }
}

export default EditorElement
