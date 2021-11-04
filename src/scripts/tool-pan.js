import Tool from './tool.js'
import { fireEvent } from './lib-events.js'

class ToolPan extends Tool {
  constructor () {
    super()

    this.name = 'pan'

    this.icon = 'pan_tool'

    this.cursor = 'grab'

    this.downFlag = false

    // STATE

    this._inputDown = null

    this._tentativeRectangle = null

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

      const iaArgs = {
        left: ws.canvasOffsetLeft,
        top: ws.canvasOffsetTop
      }

      this._downEvent = e

      this._inputDown = { ...iaArgs }
    }
    this.inputMove = (e) => {
      // get the workspace instance
      const ws = e.target

      const deltaX = e.detail.mouseEvent.clientX - this._downEvent.detail.mouseEvent.clientX
      const deltaY = e.detail.mouseEvent.clientY - this._downEvent.detail.mouseEvent.clientY

      const newLeft = this._inputDown.left + deltaX
      const newTop = this._inputDown.top + deltaY

      ws.canvasOffset(newLeft, newTop)
    }
    this.inputEnd = (e) => {
    }
    this.onToolReady = () => {

      this.app.registerKeyDownShortcut({
        key: ' ',
        action: () => {
          if(!this.downFlag){
            this.previousTool = this.app.toolActive;
          }
          this.downFlag = true;
          fireEvent(this, 'toolChange', this)
        }
      })

      this.app.registerKeyUpShortcut({
        key: ' ',
        action: () => {
          this.downFlag = false;
          fireEvent(this, 'toolChange', this.previousTool)
        }
      })
    }
  }
}

export default ToolPan
