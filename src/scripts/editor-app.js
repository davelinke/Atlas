import { fireEvent } from './lib-events.js'
import { debounce } from './lib-tools.js'

class EditorApp extends HTMLElement {
  /**
     * the button constructor
     */
  constructor () {
    super()

    // PROPS

    this._zoomScale = 1

    this.doc = null

    this.gridActive = false

    this.gridSize = 10

    this.keyDownLast = null

    this.keyDownShortcuts = {}

    this.keyboardShortcutsActive = true

    this.keyUpShortcuts = {}

    this.snapThreshold = 4

    this.toolActive = null

    this.toolDefault = 'select'

    this.toolDefaultInstance = null

    this.workspace = null

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

    this.registerKeyDownShortcut = (args) => {
      this.keyDownShortcuts[args.key] = args.action
    }

    this.registerKeyUpShortcut = (args) => {
      this.keyUpShortcuts[args.key] = args.action
    }

    this.loadDefaultTool = () => { }

    // EVENT LISTENERS

    this.addEventListener('handShake', (e) => {
      const element = e.detail
      element.onHandShake && element.onHandShake(this)
    })

    this.addEventListener('storeDocument', (e) => {
      this.storeDocument();
    })

    this.addEventListener('toolChange', (e) => {
      this.toolActive = e.detail
      this.toolActive.activateTool(this)
    })

    /*
    // what to do when workspace starts input
    this.addEventListener('mouse:down', (e) => {
      if (this.toolActive !== null) {
        this.toolActive.inputStart(e)
      }
    })

    // what to do when workspace ends input
    this.addEventListener('mouse:up', (e) => {
      if (this.toolActive !== null) {
        this.toolActive.inputEnd(e)
      }
    })

    // what to do when workspace moves input
    this.addEventListener('mouse:move', (e) => {
      if (this.toolActive !== null) {
        this.toolActive.inputMove(e)
      }
    })
    */

    // what to do when workspace moves input
    this.addEventListener('setZoom', (e) => {
      this.zoomScale = e.detail
      window.localStorage.setItem('zoomScale', this.zoomScale)
      fireEvent(this, 'zoomChange', this.zoomScale)
    })

    this.addEventListener('editorCanvasOffset', (e) => {
      this.storeOffset(e.detail)
    })

    this.onKeyDown = (e) => {
      e.preventDefault()
      e.stopPropagation()
      // console.log('keydown', e.key)
      this.keyDownLast = e.key
      this.keyDownShortcuts[e.key] && this.keyDownShortcuts[e.key](e)
    }

    this.boundKeyDown = this.onKeyDown.bind(this)

    this.onKeyUp = (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.keyDownLast = null
      this.keyUpShortcuts[e.key] && this.keyUpShortcuts[e.key](e)
    }
    this.boundKeyUp = this.onKeyUp.bind(this)

    this.addKeyShorcuts = () => {
      this.keyDownEventListener = window.addEventListener('keydown', this.boundKeyDown)
      this.keyUpEventListener = window.addEventListener('keyup', this.boundKeyUp)
    }

    this.removeKeyShorcuts = () => {
      window.removeEventListener('keydown', this.boundKeyDown)
      window.removeEventListener('keyup', this.boundKeyUp)

      this.keyDownEventListener = null
      this.keyUpEventListener = null
    }

    this.addEventListener('toggleKeyboardShortcuts', (e) => {
      if (e.detail !== 'null' && (typeof (e.detail) === 'boolean')) {
        if (e.detail) {
          this.addKeyShorcuts()
        } else {
          this.removeKeyShorcuts()
        }
      } else {
        if (this.keyDownEventListener) {
          this.removeKeyShorcuts()
        } else {
          this.addKeyShorcuts()
        }
      }
    })

    // turn keyboard shortcuts on
    this.addKeyShorcuts()

    // THE DOM STRUCTURE

    // attach shadow dom
    this._shadow = this.attachShadow({ mode: 'open' })

    // create the html
    const slot = document.createElement('slot')
    this._shadow.append(slot)
  }
}

export default EditorApp
