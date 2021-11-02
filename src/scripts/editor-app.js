import { debounce } from './lib-tools.js'

class EditorApp extends HTMLElement {
  /**
     * the button constructor
     */
  constructor () {
    super()

    // PROPS

    this.doc = null

    this._zoomScale = 1

    this.gridSize = 10

    this.gridActive = false

    this.workspace = null

    this.toolDefault = 'select'

    this.toolDefaultInstance = null

    this.toolActive = null

    this.keyboardShortcuts = {}

    this.keyboardShortcutsUp = {}

    this.keyboardShortcutsActive = true

    Object.defineProperty(this, 'zoomScale', {
      get: () => {
        return this._zoomScale
      },
      set: (val) => {
        if (val !== this._zoomScale) {
          this._zoomScale = val
        }
      }
    })

    // METHODS

    this.setModel = (key, value) => {
      this[key] = value
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
      )
    }

    this.getWorkspace = () => {
      return this.workspace
    }

    this.storeDocument = debounce(() => {
      const docHTML = this.workspace.getDocumentHTML()
      window.localStorage.setItem('currentDocument', docHTML)
    })

    this.storeOffset = debounce((e) => {
      window.localStorage.setItem('canvasOffset', JSON.stringify(e))
    })

    this.registerKeyboardShortcut = (args) => {
      this.keyboardShortcuts[args.key] = args.action
    }

    this.loadDefaultTool = () => { }

    // EVENT LISTENERS

    // setting the model through bubbled events
    this.addEventListener('setModel', (e) => {
      this.setModel(e.detail.key, e.detail.value)
    })

    // what to do when the editor becomes available
    this.addEventListener('editorWorkspaceReady', (e) => {
      this.workspace = e.detail
      this.workspace.initWorkspace(this)
    })

    // what to do when tools become available
    this.addEventListener('toolReady', (e) => {
      e.detail.registerApp(this)
      if ((this.toolActive === null) && (this.toolDefault === e.detail.name)) {
        this.toolActive = e.detail
        this.toolDefaultInstance = e.detail
        this.toolActive.activateTool(this)
      }
    })

    this.addEventListener('editorMenuActivated', (e) => {
      e.detail.registerApp(this)
    })

    this.addEventListener('toolChange', (e) => {
      this.toolActive = e.detail
      this.toolActive.activateTool(this)
    })

    // what to do when workspace starts input
    this.addEventListener('workspaceInputStart', (e) => {
      if (this.toolActive !== null) {
        this.toolActive.inputStart(e)
      }
    })

    // what to do when workspace ends input
    this.addEventListener('workspaceInputEnd', (e) => {
      if (this.toolActive !== null) {
        this.toolActive.inputEnd(e)
      }
    })

    // what to do when workspace moves input
    this.addEventListener('workspaceInputMove', (e) => {
      if (this.toolActive !== null) {
        this.toolActive.inputMove(e)
      }
    })

    // what to do when workspace moves input
    this.addEventListener('setZoom', (e) => {
      this.zoomScale = e.detail
      this.dispatchEvent(
        new CustomEvent(
          'zoomChange',
          {
            detail: this.zoomScale,
            bubbles: true,
            composed: true
          }
        )
      )
    })

    this.addEventListener('editorCanvasOffset', (e) => {
      this.storeOffset(e.detail)
    })

    window.addEventListener('keydown', (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log(e.key)
      if (this.keyboardShortcutsActive) {
        this.keyboardShortcuts[e.key] && this.keyboardShortcuts[e.key](e)
      }
    })

    window.addEventListener('keyup', (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log(e.key)
      if (this.keyboardShortcutsActive) {
        this.keyboardShortcutsUp[e.key] && this.keyboardShortcutsUp[e.key](e)
      }
    })

    this.addEventListener('toggleKeyboardShortcuts', (e) => {
      if (e.detail !== 'null' && (typeof (e.detail) === 'boolean')) {
        this.keyboardShortcutsActive = e.detail
      } else {
        this.keyboardShortcutsActive = !this.keyboardShortcutsActive
      }
    })

    // THE DOM STRUCTURE

    // attach shadow dom
    this._shadow = this.attachShadow({ mode: 'open' })

    // create the html
    const slot = document.createElement('slot')
    this._shadow.append(slot)
  }
}

export default EditorApp
