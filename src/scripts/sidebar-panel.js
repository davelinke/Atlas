import { fireEvent } from './lib-events.js'
import { createInput as ci } from './lib-utils.js'

const Css = `
:host{
    font-family: inherit;
    height: 100%;
    display:block;
}
:host(.hidden){
    position: absolute;
    opacity: 0;
    pointer-events: none;
}
.grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  grid-column-gap:0.5rem;
  grid-row-gap:0.75rem;
  margin: 1rem
}
.span-2{
  grid-column: span 2;
}
h3{
    font-family: inherit;
    font-weight: 500;
    margin: 0;
    text-transform: uppercase;
    font-size: 0.875rem;
    padding-bottom: 0.5rem;
}
.heading{
  font-weight: 500;
  font-size: 0.75rem;
  text-transform: uppercase;
  grid-column: span 2;
  display:flex;
  align-items:center;
  justify-content:space-between;
}
.heading button{
  background: none;
  border: none;
  cursor: pointer;
}
.border-bottom{
  border-bottom: 1px solid var(--sidebar-separator-border-color, #e0e0e0);
}
.separator{
  border-bottom: 1px solid var(--sidebar-separator-border-color, #e0e0e0);
  grid-column: span 2;
}
.scroller{
  height: 100%;
  overflow-y: auto;
}
.input-wrap{
    display: inline-flex;
    background-color: #efefef;
    border-radius: 3px;
    height: 23px;
    align-items: center;
    width: 100%;
}
.input-wrap > * {
  height: 100%;
  cursor: text;
}
.input-wrap.range-2{
  background-color: transparent;
  grid-column: span 2;
}
.input-label{
    display: inline-flex;
    padding: 0 4px;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}
`
class SidebarPanel extends HTMLElement {
  constructor () {
    super()

    // STATE
    this.app = null

    this.pickLengthShow = 0

    this.mainHeading = null

    // METHODS

    this.pickChange = (e) => {
      this.showHide(e)
      this.onPickChange && this.onPickChange(e)
    }

    this.pickModEnd = (e) => {
      this.onPickModEnd && this.onPickModEnd(e)
    }

    this.pickModStart = (e) => {
      this.onPickModStart && this.onPickModStart(e)
    }

    this.createInput = (args, appendTo = this.grid, unit = 'px') => {
      // name, initial, icon = null, type = 'number'
      const wrap = document.createElement('div')
      wrap.classList.add('input-wrap')
      args.wrap?.class ? wrap.classList.add(args.wrap.class) : null
      wrap.setAttribute('title', args.input.name)

      const input = ci(args.input)
      if (args.label) {
        const label = document.createElement('label')
        label.classList.add('input-label')
        label.setAttribute('for', args.input.name)
        label.innerHTML = args.label?.icon ? `<i class="${args.label.icon}"></i>` : args.label?.initial
        label.addEventListener('click', () => {
          input.focus()
        })
        wrap.appendChild(label)
      }

      wrap.appendChild(input)

      if (unit) {
        const unitLabel = document.createElement('label')
        unitLabel.classList.add('input-label')
        unitLabel.innerHTML = unit
        unitLabel.addEventListener('click', () => {
          input.focus()
        })
        wrap.appendChild(unitLabel)
      }

      appendTo.appendChild(wrap)

      return input
    }

    this.showHide = (e) => {
      const pick = e.detail
      if (this.pickLengthShow(pick)) {
        this.classList.remove('hidden')
      } else {
        this.classList.add('hidden')
      }
    }

    this.addSeparator = () => {
      const separator = document.createElement('div')
      separator.classList.add('separator')
      this.grid.appendChild(separator)
    }

    this.addHeading = (text, addbutton = false) => {
      const heading = document.createElement('div')
      heading.classList.add('heading')
      heading.innerHTML = text
      if (addbutton) {
        const button = document.createElement('button')
        button.classList.add('add-button')
        button.innerHTML = '<i class="fa-solid fa-plus"></i>'
        heading.appendChild(button)
      }
      this.grid.appendChild(heading)
      return heading
    }

    this.onHandShake = (app) => {
      this.app = app

      this.app.addEventListener('pickChange', this.pickChange)

      this.app.addEventListener('canvasModEnd', this.pickModEnd)

      this.app.addEventListener('canvasModStart', this.pickModStart)
    }

    // STRUCTURE
    this._shadow = this.attachShadow({ mode: 'open' })

    const styles = document.createElement('style')
    styles.innerHTML = Css
    this._shadow.appendChild(styles)

    const fontawesome = document.createElement('link')
    fontawesome.setAttribute('rel', 'stylesheet')
    fontawesome.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css')
    this._shadow.appendChild(fontawesome)

    const scroller = document.createElement('div')
    scroller.classList.add('scroller')

    this.grid = document.createElement('div')
    this.grid.classList.add('grid')

    scroller.appendChild(this.grid)
    this._shadow.appendChild(scroller)

    this.mainHeadingElement = document.createElement('h3')
    this.mainHeadingElement.classList.add('span-2')
    this.mainHeadingElement.classList.add('border-bottom')
    this.grid.appendChild(this.mainHeadingElement)
  }

  async connectedCallback () {
    !this.isDefaultPanel && this.classList.add('hidden')

    this.mainHeading && (this.mainHeadingElement.innerHTML = this.mainHeading)

    fireEvent(this, 'handShake', this)
  }
}

export default SidebarPanel
