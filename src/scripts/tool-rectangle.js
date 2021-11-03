import Tool from './tool.js'
import { filterCoord } from './lib-filters.js'

class ToolRectangle extends Tool {
  /**
       * the button constructor
       */
  constructor () {
    super()

    // PROPS
    this.name = 'rectangle'

    this.icon = 'crop_din'

    // STATE

    this._inputDown = null

    this._tentativeRectangle = null

    this.app = null

    // METHODS

    this.toolInit = (app) => {
      // do stuff on initialization
      const ws = app.workspace
      this.app = app
      ws && ws.deactivateSelection()
    }
    this.toolDestroy = (app) => {
      // do stuff on destruction
    }
    this.inputStart = (e) => {
      const ws = e.target
      const gridActive = this.app.gridActive

      const id = {
        top: e.detail.coords.top - ws.canvasOffsetTop,
        left: e.detail.coords.left - ws.canvasOffsetLeft,
        bottom: ws.viewportDim - (e.detail.coords.top - ws.canvasOffsetTop),
        right: ws.viewportDim - (e.detail.coords.left - ws.canvasOffsetLeft)
      }
      this._inputDown = id

      let top, left, bottom, right

      if (gridActive) {
        top = filterCoord(id.top, ws.gridSize)
        left = filterCoord(id.left, ws.gridSize)
        bottom = filterCoord(id.bottom, ws.gridSize)
        right = filterCoord(id.right, ws.gridSize)
      } else {
        top = id.top
        left = id.left
        bottom = id.bottom
        right = id.right
      }

      const iaArgs = {
        top: top,
        left: left,
        right: right,
        bottom: bottom
      }
      ws.inputAreaStart({ ...iaArgs, variant: 'solid' })
    }
    this.inputMove = (e) => {
      // get the workspace instance
      const ws = e.target

      // get the initial point of input (mousedown, touchstart)
      const id = this._inputDown

      const im = {
        top: e.detail.coords.top - ws.canvasOffsetTop,
        left: e.detail.coords.left - ws.canvasOffsetLeft,
        bottom: ws.viewportDim - (e.detail.coords.top - ws.canvasOffsetTop),
        right: ws.viewportDim - (e.detail.coords.left - ws.canvasOffsetLeft)
      }

      // define the dimension variables
      let top, left, right, bottom

      // if the current position is smaller than the initial position (X axis)
      if (im.left < id.left) {
        left = im.left
        right = id.right
      } else { // if the current position is greater than the initial position (X axis)
        left = id.left
        right = im.right
      }

      // if the current position is smaller than the initial position (Y axis)
      if (im.top < id.top) {
        top = im.top
        bottom = id.bottom
      } else { // if the current position is greater than the initial position (Y axis)
        top = id.top
        bottom = im.bottom
      }

      // if the grid is active
      if (this.app.gridActive) {
        // filter the coordinates
        top = filterCoord(top, this.app.gridSize)
        left = filterCoord(left, this.app.gridSize)
        bottom = filterCoord(bottom, this.app.gridSize)
        right = filterCoord(right, this.app.gridSize)
      }

      // set the tentative rectangle
      const iArgs = {
        top: top,
        left: left,
        right: right,
        bottom: bottom
      }

      // hold this in the state
      this._tentativeRectangle = iArgs

      // update the dummy rectangle in the workspace
      ws.inputAreaResize(iArgs)
    }
    this.inputEnd = (e) => {
      const ws = e.target

      let addedElement = null

      if (this._tentativeRectangle) {
        addedElement = ws.addElement(this._tentativeRectangle)

        // store the doc
        this.app.storeDocument()
      }

      this._inputDown = null
      this._tentativeRectangle = null

      ws.inputAreaClear()

      this.dispatchEvent(new CustomEvent('toolChange', { detail: this.app.toolDefaultInstance, bubbles: true, composed: true }))
      addedElement && this.dispatchEvent(new CustomEvent('selectPickAdd', { detail: [addedElement], bubbles: true, composed: true }))
    }
    this.onToolReady = () => {
      this.app.registerKeyDownShortcut({
        key: 'r',
        action: () => {
          this.dispatchEvent(new CustomEvent('toolChange', { detail: this, bubbles: true, composed: true }))
        }
      })
    }
  }
}

export default ToolRectangle
