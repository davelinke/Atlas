import Tool from './tool.js'
import { fireEvent } from './lib-events.js'
import { filterCoord } from './lib-filters.js'
import { propUnitsJs } from './lib-units.js'

const CssPa = `
.editor-workspace-pa {
    border: 1px solid blue;
    position: absolute;
    z-index: 50000;
    pointer-events: none;
    box-sizing: border-box;
    
    outline: 1px solid transparent;
    -webkit-backface-visibility: hidden;
}
.editor-workspace-pa-handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background:#fff;
    border: 1px solid blue;
    box-sizing: border-box;
    box-shadow: 0px 1px 2px rgb(0 0 0 / 25%);
    pointer-events: all;
}
.editor-workspace-pa-handle.nw {
    top: -5px;
    left: -5px;
    cursor: nwse-resize;
}
.editor-workspace-pa-handle.n {
    top: -5px;
    left: calc(50% - 5px);
    cursor: ns-resize;
}
.editor-workspace-pa-handle.ne {
    top: -5px;
    right: -5px;
    cursor: nesw-resize;
}
.editor-workspace-pa-handle.e {
    top: calc(50% - 5px);
    right: -5px;
    cursor: ew-resize;
}
.editor-workspace-pa-handle.se {
    bottom: -5px;
    right: -5px;
    cursor: nwse-resize;
}
.editor-workspace-pa-handle.s {
    bottom: -5px;
    left: calc(50% - 5px);
    cursor: ns-resize;
}
.editor-workspace-pa-handle.sw {
    bottom: -5px;
    left: -5px;
    cursor: nesw-resize;
}
.editor-workspace-pa-handle.w {
    top: calc(50% - 5px);
    left: -5px;
    cursor: ew-resize;
}

.editor-workspace-da{
  border: 1px dotted #ccc;
  position: fixed;
  z-index: 50001;
  pointer-events: none;
  box-sizing: border-box;
  opacity:0;
  
  outline: 1px solid transparent;
  -webkit-backface-visibility: hidden;
}
`

class ToolSelect extends Tool {
  constructor() {
    super()

    this.name = 'select'
    this.icon = 'near_me'
    this.iconClass = 'fa-solid fa-arrow-pointer'
    this.key = 'v'

    this.isAdding = false
    this.isCopying = false
    this.constrainAngle = false

    this.pick = []

    this.pickAreaElement = null
    this.pickAreaHidden = false

    this.appReference = null
    this.pickStart = null

    this.inputStartPos = null

    this.dragSelect = false

    // METHODS

    // lets return the specific element that was clicked
    this.getCompElement = (path) => {
      for (const element of path) {
        if (element.tagName && (element.tagName === 'EDITOR-ELEMENT')) {
          return element
        }
      }

      return null
    }

    // returns the class of the modifier in use
    this.getModTask = (path) => {
      return path[0].classList[0]
    }

    this.resizePickArea = () => {
      if (this.pick.length > 0) {
        const viewportDim = this.appReference.workspace.viewportDim

        let lowestX = null
        let lowestY = null
        let highestX = null
        let highestY = null
        this.pick.forEach(element => {
          const elementDims = element.getDimensions()
          const x = elementDims.left
          const y = elementDims.top

          const xw = x + element.offsetWidth
          const yh = y + element.offsetHeight

          if (lowestX === null || x < lowestX) {
            lowestX = x
          }
          if (lowestY === null || y < lowestY) {
            lowestY = y
          }
          if (highestX === null || xw > highestX) {
            highestX = xw
          }
          if (highestY === null || yh > highestY) {
            highestY = yh
          }
        })

        const left = lowestX
        const top = lowestY
        const width = highestX - lowestX
        const height = highestY - lowestY
        const right = viewportDim - (lowestX + width)
        const bottom = viewportDim - (lowestY + height)

        this.pickAreaElement.setDimension('left', left);
        this.pickAreaElement.setDimension('top', top);
        this.pickAreaElement.setDimension('right', right);
        this.pickAreaElement.setDimension('bottom', bottom);
      } else {
        this.pickAreaElement.setDimension('opacity', 0);
      }
    }

    this.firePickChangeEvent = () => {
      fireEvent(this, 'pickChange', this.pick)
    }

    this.addToPick = (element) => {
      //console.log('addToPick')
      element.picked = true
      this.pick.push(element)
      this.resizePickArea()
      //this.firePickChangeEvent()
    }

    this.removeFormPick = (element) => {
      console.log('removeFormPick')
      element.picked = false
      this.pick.splice(this.pick.indexOf(element), 1)
      this.resizePickArea()
      this.firePickChangeEvent()
    }

    this.pickStartUpdate = () => {
      const viewportDim = this.appReference.workspace.viewportDim

      this.pickStart = this.pick.map((element) => {
        const elementDims = element.getDimensions()
        const left = elementDims.left
        const top = elementDims.top
        return {
          left: left,
          top: top,
          width: element.offsetWidth,
          height: element.offsetHeight,
          right: viewportDim - (left + element.offsetWidth),
          bottom: viewportDim - (top + element.offsetHeight)
        }
      })
    }

    // defines if an element should be added or not to the elements being modified
    this.pickRegister = (element) => {
      if (element.picked) {
        if (this.isAdding) {
          this.removeFormPick(element)
        }
      } else {
        // if no shift key is pressed, clear the pick
        if (!this.isAdding) {
          this.deselectAll()
        }
        // and add the element to the pick
        this.addToPick(element)
      }
      this.pickStartUpdate()
    }
    this.deselectAll = () => {
      for (const element of this.pick) {
        element.picked = false
      }
      this.pick = []
      this.resizePickArea()
    }

    // keeping all modifier tasks inside an object
    this.modTasks = {}

    // the mod task for moving objects
    this.modTasks.mod = (element, i, e) => {
      const delta = {
        x: (e.detail.mouseEvent.clientX - this.inputStartPos.x) / this.appReference.zoomScale,
        y: (e.detail.mouseEvent.clientY - this.inputStartPos.y) / this.appReference.zoomScale
      }

      const newLeft = this.pickStart[i].left + delta.x
      const newTop = this.pickStart[i].top + delta.y

      const newRight = this.pickStart[i].right - delta.x
      const newBottom = this.pickStart[i].bottom - delta.y

      element.setProp('left', this.applyFilters(newLeft))
      element.setProp('top', this.applyFilters(newTop))

      element.setProp('right', this.applyFilters(newRight))
      element.setProp('bottom', this.applyFilters(newBottom))

      // fire the events

      // store the doc
      this.appReference.storeDocument()
    }

    this.applyFilters = (value) => {
      const gridActive = this.appReference.gridActive
      const gridSize = this.appReference.gridSize

      if (gridActive) {
        return Math.round(value / gridSize) * gridSize
      }

      return value
    }

    this.startResize = (e) => {
      // prevent the propagation of the event
      e.preventDefault()
      e.stopPropagation()

      fireEvent(this, 'canvasModStart', this.pick)

      // flag that we are resizing
      this.resizing = true

      // find out the orientations of the resize
      this.resizeV = e.target.dataset.resizeV !== '' ? e.target.dataset.resizeV : false
      this.resizeH = e.target.dataset.resizeH !== '' ? e.target.dataset.resizeH : false

      // save the coords of the down event
      this.resizeDownCoords = {
        x: e.clientX,
        y: e.clientY
      }

      // calculate and store the dimensions of the resizing area at the beginning
      const areaStart = this.pickAreaElement.getDimensions()

      // save the dimensions of the elements to be resized in the beginning
      const pickStart = this.pick.map((element) => {
        const elementDims = element.getDimensions()
        return {
          left: elementDims.left,
          top: elementDims.top,
          right: elementDims.right,
          bottom: elementDims.bottom
        }
      })

      // a function for resizing forwards (when locked side is either left or top)
      const resizeFw = (o, proportions) => {
        const viewportDim = this.appReference.workspace.viewportDim

        const dims = {
          y: {
            start: 'top',
            end: 'bottom'
          },
          x: {
            start: 'left',
            end: 'right'
          }
        }

        const start = dims[o].start
        const end = dims[o].end

        const areaStartMag = (viewportDim - areaStart[end]) - areaStart[start]

        // i obtain the new area width calculatinng the initial width
        // multiplied by the new proportion of the x axis
        const newAreaMag = this.applyFilters(areaStartMag * proportions[o])

        if (newAreaMag > 0) {
          const newAreaDelta = newAreaMag - areaStartMag

          // and of course we need to update the width of the pick area
          const pickAreaEnd = this.applyFilters(areaStart[end] - newAreaDelta)

          // with this information i can calculate teh new left and widths of all the elements
          this.pick.forEach((element, i) => {
            // calculate new start position
            const pctStart = (pickStart[i][start] - areaStart[start]) / areaStartMag
            const newStart = areaStart[start] + (newAreaMag * pctStart)

            element.setProp(start, Math.round(newStart))// add filtering/grid here

            // calculate new end position
            const pctEnd = (pickStart[i][end] - areaStart[end]) / areaStartMag
            const newEnd = pickAreaEnd + (newAreaMag * pctEnd)

            element.setProp(end, newEnd)// add filtering/grid here
          })
          this.pickAreaElement.setDimension(end, pickAreaEnd);

          // store the doc
          this.appReference.storeDocument()
        }
      }

      const resizeBw = (o, proportions) => {
        const viewportDim = this.appReference.workspace.viewportDim

        const dims = {
          y: {
            start: 'top',
            end: 'bottom'
          },
          x: {
            start: 'left',
            end: 'right'
          }
        }

        const start = dims[o].start
        const end = dims[o].end

        const areaStartMag = (viewportDim - areaStart[end]) - areaStart[start]

        // i obtain the new area width calculatinng the initial width
        // multiplied by the new proportion of the x axis
        const newAreaMag = Math.round(
          (
            areaStartMag * proportions[o]

          ) * 10) / 10

        if (newAreaMag > 0) {
          const newAreaDelta = newAreaMag - areaStartMag

          // and of course we need to update the width of the pick area
          const pickAreaStart = this.applyFilters(areaStart[start] - newAreaDelta)

          this.pick.forEach((element, i) => {
            // calculate new start position
            const pctStart = (pickStart[i][start] - areaStart[start]) / areaStartMag
            const newStart = pickAreaStart + (newAreaMag * pctStart)

            element.setProp(start, newStart) // add filtering/grid here

            // calculate new end position
            const pctEnd = (pickStart[i][end] - areaStart[end]) / areaStartMag
            const newEnd = areaStart[end] + (newAreaMag * pctEnd)

            element.setProp(end, newEnd) // add filtering/grid here
          })

          this.pickAreaElement.setDimension(start, pickAreaStart);

          // store the doc
          this.appReference.storeDocument()
        }
      }

      // an object that determines which functions to use depending on the orientations of the resize
      const resizeFunctions = {
        n: (e, proportions) => {
          resizeBw('y', proportions)
        },
        e: (e, proportions) => {
          resizeFw('x', proportions)
        },
        s: (e, proportions) => {
          resizeFw('y', proportions)
        },
        w: (e, proportions) => {
          resizeBw('x', proportions)
        }
      }

      // the resizing function when the mouse is moving
      const resize = (e) => {
        e.preventDefault()
        e.stopPropagation()

        this.pickAreaElement.setDimension('opacity', 0)

        const zoomScale = this.appReference.zoomScale

        const viewportDim = this.appReference.workspace.viewportDim

        const proportions = {
          x: null,
          y: null
        }

        if (this.resizeV === 's') {
          const areaStartHeight = (viewportDim - areaStart.top) - areaStart.bottom
          proportions.y = (
            areaStartHeight +
            ((e.clientY - this.resizeDownCoords.y) / zoomScale)
          ) / areaStartHeight
        }
        if (this.resizeV === 'n') {
          const areaStartHeight = (viewportDim - areaStart.top) - areaStart.bottom
          proportions.y = (
            areaStartHeight +
            ((this.resizeDownCoords.y - e.clientY) / zoomScale)
          ) / areaStartHeight
        }

        if (this.resizeH === 'e') {
          const areaStartWidth = (viewportDim - areaStart.right) - areaStart.left
          proportions.x = (
            areaStartWidth +
            ((e.clientX - this.resizeDownCoords.x) / zoomScale)
          ) / areaStartWidth
        }
        if (this.resizeH === 'w') {
          const areaStartWidth = (viewportDim - areaStart.right) - areaStart.left
          proportions.x = (
            areaStartWidth +
            ((this.resizeDownCoords.x - e.clientX) / zoomScale)
          ) / areaStartWidth
        }

        if (this.resizeV) {
          resizeFunctions[this.resizeV](e, proportions)
        }
        if (this.resizeH) {
          resizeFunctions[this.resizeH](e, proportions)
        }
      }

      // the stop resize function that clears event listeners and resets the flags
      const stopResize = (e) => {
        e.preventDefault()
        e.stopPropagation()

        this.pickAreaElement.setDimension('opacity', 1)

        this.resizing = false
        this.resizeV = null
        this.resizeH = null
        this.resizeDownCoords = null

        this.pickStartUpdate()
        document.removeEventListener('mousemove', resize)
        document.removeEventListener('touchmove', resize)
        document.removeEventListener('mouseup', stopResize)
        document.removeEventListener('touchend', stopResize)

        fireEvent(this, 'canvasModEnd', this.pick)
      }

      // the event listerners for the subsequent move and mouseup events
      document.addEventListener('mouseup', stopResize)
      document.addEventListener('touchend', stopResize)
      document.addEventListener('mousemove', resize)
      document.addEventListener('touchmove', resize)
    }

    this.toolInit = (app) => {
      // do stuff on initialization
      console.log(app.canvas)
      const canvas = app.canvas

      canvas.off('mouse:down');
      canvas.off('mouse:move');
      canvas.off('mouse:up');

      canvas.selection = true;
      canvas.forEachObject(function (o) {
        o.selectable = true;
      });
    }
    this.toolDestroy = (app) => {
      // do stuff on destruction
    }

    this.dragPick = () => {
      this.dragCoveredElements = []
      const elements = this.appReference.workspace.getElements()
      const pickArea = this._tentativeRectangle
      const viewportDim = this.appReference.workspace.viewportDim

      elements.forEach(element => {
        const eDims = element.getDimensions()

        const elRectX = eDims.left
        const elRectY = eDims.top
        const elRectW = (viewportDim - eDims.right - elRectX)
        const elRectH = (viewportDim - eDims.bottom - elRectY)

        const elRectX2 = elRectX + elRectW
        const elRectY2 = elRectY + elRectH

        const pickAreaX = pickArea.left
        const pickAreaY = pickArea.top
        const pickAreaW = (viewportDim - pickArea.right) - pickAreaX
        const pickAreaH = (viewportDim - pickArea.bottom) - pickAreaY

        const pickAreaX2 = pickAreaX + pickAreaW
        const pickAreaY2 = pickAreaY + pickAreaH

        if (
          elRectX <= pickAreaX2 &&
          elRectX2 >= pickAreaX &&
          elRectY <= pickAreaY2 &&
          elRectY2 >= pickAreaY
        ) {
          this.dragCoveredElements.push(element)
        }
      })
    }

    this.inputStart = (e) => {
      const me = e.detail.mouseEvent
      const ePath = me.path || (me.composedPath && me.composedPath());
      const element = this.getCompElement(ePath)
      const shiftKey = e.detail.mouseEvent.shiftKey
      //   const ctrlKey = me.ctrlKey
      //   const altKey = me.altKey

      fireEvent(this, 'canvasModStart', this.pick)

      this.inputStartPos = {
        x: me.clientX,
        y: me.clientY
      }

      this.modTask = this.getModTask(ePath)

      // to determine the future of the pick after the drag i have to compare it to it's actual state so let's hold it in memory
      this.pickBeforeDrag = [...this.pick]

      if (element) {
        // either i am (adding/removing) an element

        this.isAdding = shiftKey // shift key determines if it's adding or not

        if (shiftKey) { // i am definitely adding or removing
          this.pickRegister(element)
        } else { // no shift means i am clearing the selection and starting with an element
          if (this.pick.includes(element)) {
            // just move
          } else {
            this.deselectAll() // clear the pick

            this.pickRegister(element)
            this.firePickChangeEvent() // fire the change event
          }
        }
      } else {
        // or i am either clearing the pick or starting a drag

        this.dragSelect = true // flag the drag

        // taken from rectangle to create the drag area

        const ws = e.target

        const id = {
          top: e.detail.coords.top - ws.canvasOffsetTop,
          left: e.detail.coords.left - ws.canvasOffsetLeft,
          bottom: ws.viewportDim - (e.detail.coords.top - ws.canvasOffsetTop),
          right: ws.viewportDim - (e.detail.coords.left - ws.canvasOffsetLeft)
        }
        this._inputDown = id

        const top = id.top
        const left = id.left
        const bottom = id.bottom
        const right = id.right

        const iaArgs = {
          top: top,
          left: left,
          right: right,
          bottom: bottom
        }
        ws.inputAreaStart({ ...iaArgs, variant: 'drag-area' })

        // end

        if (shiftKey) { // i may be starting a drag add/remove

        } else { // no shift means i have to clear the pick and start a drag
          this.deselectAll() // clear the pick
          console.log('inputStart')
          this.firePickChangeEvent() // fire the change event
        }
      }
    }

    this.inputMove = (e) => {
      const shiftKey = e.detail.mouseEvent.shiftKey
      //   const ctrlKey = e.detail.mouseEvent.ctrlKey
      //   const altKey = e.detail.mouseEvent.altKey
      if (!this.pickAreaHidden) {
        this.pickAreaElement.setDimension('opacity', 0);
      }

      // i have to determine if this is a dragselect to either move or manage the pick

      if (!this.dragSelect) { // if it's not a drag select, means i clicked on an element and i have to MOVE THE PICK
        this.constrainAngle = shiftKey // if the shift key is pressed it means that my movements are restrained in angles of 45 degrees

        this.pick.forEach((element, i) => {
          this.modTasks[this.modTask](element, i, e)
        })
      } else { // if it's a drag select, means i have to MANAGE THE PICK
        // taken from rectangel to resize the drag area

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

        this.dragPick()
      }

      // resize the pick area to it's new position and dimensions
      this.resizePickArea()
    }

    this.inputEnd = (e) => {
      this.moveIncrementX = null
      this.moveIncrementY = null

      // lets flag the dragselection off

      if (this.dragSelect && this.dragCoveredElements) {
        const ws = e.target

        this.dragCoveredElements.forEach(element => {
          this.isAdding = true
          this.pickRegister(element)
          this.isAdding = false
        })

        this.pickBeforeDrag = []
        this.dragCoveredElements = []

        this._inputDown = null
        this._tentativeRectangle = null

        this.dragSelect = false

        ws.inputAreaClear()
      }

      // update pickstart

      this.pickStartUpdate()

      if (this.pick.length > 0) {
        this.pickAreaElement.setDimension('opacity', 1);
        // this.pickAreaElement.style.opacity = 1
        this.pickAreaHidden = false
      }

      fireEvent(this, 'canvasModEnd', this.pick)
    }

    this.onToolReady = () => {
      this.app.registerKeyDownShortcut({
        key: 'Escape',
        action: () => {
          fireEvent(this, 'toolChange', this)
        }
      })

      this.app.addEventListener('selectPickAdd', (e) => {
        const elementsToPick = e.detail
        elementsToPick.forEach((element) => {
          this.pickRegister(element)
        })

        this.pickAreaElement.setDimension('opacity', 1)
        this.pickAreaHidden = false
      })

      this.app.addEventListener('editorElementRemoved', (e) => {
        if (this.pick.includes(e.detail)) {
          const newPick = [...this.pick]
          newPick.splice(this.pick.indexOf(e.detail), 1)
          this.pick = newPick
          this.resizePickArea()
          console.log('removed from pick')
          this.firePickChangeEvent()
        }
      })

      this.app.addEventListener('resizePickArea', (e) => {
        this.resizePickArea()
      })
    }
  }
}

export default ToolSelect
