import { fireEvent } from './lib-events.js'
import { debounce } from './lib-tools.js'

class EditorApp extends HTMLElement {
  /**
   * this is the main class of the editor
   * where we hold the global state
   */
  constructor() {
    super()

    /**
     * THE APP STATE
     */

    // the document structure
    this.doc = null

    // the zoom scale
    this._zoomScale = 1

    // the size of the grid (for snap to grid)
    this.gridSize = 10

    // is the grid active?
    this.gridActive = false

    // the workspace
    this.workspace = null

    // the default tool
    this.toolDefault = 'select'

    // the instance of the default too
    this.toolDefaultInstance = null

    // the current tool
    this.toolActive = null

    // the object containing all the shortcuts
    this.keyDownShortcuts = {}

    // what was the last key that you pressed?
    this.keyDownLast = null

    // the object containing all the keyup shortcuts
    this.keyUpShortcuts = {}

    // are the keyboard shortcuts active?
    this.keyboardShortcutsActive = true

    // define the zoom also as property
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

    /**
     * a method to get the workspace
     */
    this.getWorkspace = () => {
      return this.workspace
    }

    /**
     * a method to store the document
     */
    this.storeDocument = debounce(() => {
      const docHTML = this.workspace.getDocumentHTML()
      window.localStorage.setItem('currentDocument', docHTML)
    })

    /**
     * a method to store the offset of the workspace (pan position)
     */
    this.storeOffset = debounce((e) => {
      window.localStorage.setItem('canvasOffset', JSON.stringify(e))
    })

    /**
     * a method to register a global keydown shortcut helper
     */
    this.registerKeyDownShortcut = (args) => {
      this.keyDownShortcuts[args.key] = args.action
    }

    /**
     * a method to register a global keyup shortcut helper
     */
    this.registerKeyUpShortcut = (args) => {
      this.keyUpShortcuts[args.key] = args.action
    }

    /**
     * a method to load the tool that has been set as default (pointer)
     */
    this.loadDefaultTool = () => { }

    /**
     * a method to handle key down shortcuts
     */
    this.onKeyDown = (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.keyDownLast = e.key
      this.keyDownShortcuts[e.key] && this.keyDownShortcuts[e.key](e)
    }

    /**
     * just binding the class to the keydown handler
     */
    this.boundKeyDown = this.onKeyDown.bind(this)

    /**
     * a method to handle key up shortcuts
     */
    this.onKeyUp = (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.keyDownLast = null
      this.keyUpShortcuts[e.key] && this.keyUpShortcuts[e.key](e)
    }

    /**
     * just binding the class to the keyup handler
     */
    this.boundKeyUp = this.onKeyUp.bind(this)

    /**
     * a method to instantiate keydown and keyup listeners
     */
    this.addKeyShorcuts = () => {
      this.keyDownEventListener = window.addEventListener('keydown', this.boundKeyDown)
      this.keyUpEventListener = window.addEventListener('keyup', this.boundKeyUp)
    }

    /**
     * a method to remove keydown and keyup listener instances
     */
    this.removeKeyShorcuts = () => {
      window.removeEventListener('keydown', this.boundKeyDown)
      window.removeEventListener('keyup', this.boundKeyUp)

      this.keyDownEventListener = null
      this.keyUpEventListener = null
    }

    /**
     * EVENT LISTENERS
     */


    /**
     * the handshake event listeners that gives visibility to other components of the app
     */
    this.addEventListener('handShake', (e) => {
      const element = e.detail
      element.onHandShake && element.onHandShake(this)
    })

    /**
     * an event listener to store the document at it's current state
     */
    this.addEventListener('storeDocument', (e) => {
      this.storeDocument();
    })

    /**
     * an event listener to change the current tool
     */
    this.addEventListener('toolChange', (e) => {
      this.toolActive = e.detail
      this.toolActive.activateTool(this)
    })

    /**
     * an event listener that what to do when user starts input on the workspace
     */
    this.addEventListener('workspaceInputStart', (e) => {
      if (this.toolActive !== null) {
        this.toolActive.inputStart && this.toolActive.inputStart(e)
      }
    })

    /**
     * an event listener that what to do when user ends input on the workspace
     */
    this.addEventListener('workspaceInputEnd', (e) => {
      if (this.toolActive !== null) {
        this.toolActive.inputEnd && this.toolActive.inputEnd(e)
      }
    })

    // what to do when workspace moves input
    /**
     * an event listener that what to do when user moves on the workspace
     */
    this.addEventListener('workspaceInputMove', (e) => {
      if (this.toolActive !== null) {
        this.toolActive.inputMove && this.toolActive.inputMove(e)
      }
    })

    /**
     * an event listener to set the workspace zoom scale
     */
    this.addEventListener('setZoom', (e) => {
      this.zoomScale = e.detail
      window.localStorage.setItem('zoomScale', this.zoomScale)
      fireEvent(this, 'zoomChange', this.zoomScale)
    })

    /**
     * an event listener to store the canvas offset
     */
    this.addEventListener('editorCanvasOffset', (e) => {
      this.storeOffset(e.detail)
    })

    /**
     * an event listener to toggle the keyboard shortcuts
     */
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

    /**
     * LET'S INITIALIZE STUFF
     */

    // turn keyboard shortcuts on
    this.addKeyShorcuts()

    /**
     * LET'S CREATE THE SHADOW DOM STRUCTURE OF THE COMPONENT
     */

    // attach shadow dom
    this._shadow = this.attachShadow({ mode: 'open' })

    // create the html
    const slot = document.createElement('slot')
    this._shadow.append(slot)
  }
}

export default EditorApp
