import Tool from './tool.js'

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

    // METHODS

    this.toolInit = (app) => {
      // do stuff on initialization
      const ws = app.workspace
      ws && ws.deactivateSelection()
    }
    this.toolDestroy = (app) => {
      // do stuff on destruction
    }
    this.inputStart = (e) => {
      const ws = e.target

      const iaArgs = {
        top: e.detail.coords.y - ws.canvasOffsetTop,
        left: e.detail.coords.x - ws.canvasOffsetLeft,
        width: 0,
        height: 0
      }
      this._inputDown = { ...iaArgs }
      ws.inputAreaStart({ ...iaArgs, variant: 'solid' })
    }
    this.inputMove = (e) => {
      // get the workspace instance
      const ws = e.target

      // get the deltas from the input
      const deltaX = e.detail.delta.x
      const deltaY = e.detail.delta.y

      // get the initial point of input (mousedown, touchstart)
      const downTop = this._inputDown.top
      const downLeft = this._inputDown.left

      // define the dimension variables
      let width, height, top, left

      // if the current position is smaller than the initial position (X axis)
      if (deltaX < 0) {
        width = Math.abs(deltaX)
        left = (downLeft + deltaX)
      } else { // if the current position is greater than the initial position (X axis)
        width = deltaX
        left = downLeft
      }

      // if the current position is smaller than the initial position (Y axis)
      if (deltaY < 0) {
        height = Math.abs(deltaY)
        top = (downTop + deltaY)
      } else { // if the current position is greater than the initial position (Y axis)
        height = deltaY
        top = downTop
      }

      // set the tentative rectangle
      const iArgs = {
        top: top,
        left: left,
        width: width,
        height: height
      }

      // hold this in the state
      this._tentativeRectangle = iArgs

      // update the dummy rectangle in the workspace
      ws.inputAreaResize(iArgs)
    }
    this.inputEnd = (e) => {
      const ws = e.target

      if (this._tentativeRectangle) {
        ws.addElement(this._tentativeRectangle)
      }

      this._inputDown = null
      this._tentativeRectangle = null

      ws.inputAreaClear()
    }
  }
}

export default ToolRectangle
