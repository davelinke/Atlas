class EditorMenu extends HTMLElement {
  constructor () {
    super()

    // attach shadow dom
    this._shadow = this.attachShadow({ mode: 'open' })

    this.setAttribute('role', 'menubar')

    // create the html
    const slot = document.createElement('slot')
    this._shadow.append(slot)
  }
}

export default EditorMenu
