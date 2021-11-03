import Tool from './tool.js'

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
`

class ToolSelect extends Tool {
  constructor() {
    super()

    this.name = 'select'
    this.icon = 'near_me'
    this.iconClass = 'reflect'
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
      const viewportDim = this.appReference.workspace.viewportDim

      let lowestX = null
      let lowestY = null
      let highestX = null
      let highestY = null
      this.pick.forEach(element => {
        const x = parseInt(element.style.left.replace('px', ''), 10)
        const y = parseInt(element.style.top.replace('px', ''), 10)

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

      this.pickAreaElement.style.left = left + 'px'
      this.pickAreaElement.style.top = top + 'px'
      // this.pickAreaElement.style.width = (highestX - lowestX) + 'px';
      // this.pickAreaElement.style.height = (highestY - lowestY) + 'px';
      this.pickAreaElement.style.right = right + 'px'
      this.pickAreaElement.style.bottom = bottom + 'px'
    }

    this.firePickChangeEvent = () => {
      this.dispatchEvent(new CustomEvent('pickChange', { detail: this.pick, bubbles: true, composed: true }))
    }

    this.addToPick = (element) => {
      element.picked = true
      this.pick.push(element)
      this.resizePickArea()
      this.firePickChangeEvent()
    }

    this.removeFormPick = (element) => {
      element.picked = false
      this.pick.splice(this.pick.indexOf(element), 1)
      this.resizePickArea()
      this.firePickChangeEvent()
    }

    // defines if an element should be added or not to the elements being modified
    this.pickRegister = (element) => {
      const viewportDim = this.appReference.workspace.viewportDim
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
      this.pickStart = this.pick.map((element) => {
        const left = parseInt(element.style.left.replace('px', ''), 10)
        const top = parseInt(element.style.top.replace('px', ''), 10)
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
    this.deselectAll = () => {
      for (const element of this.pick) {
        element.picked = false
      }
      this.pick = []
      this.pickAreaElement.style.opacity = 0
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

      element.style.left = this.applyFilters(newLeft) + 'px'
      element.style.top = this.applyFilters(newTop) + 'px'

      element.style.right = this.applyFilters(newRight) + 'px'
      element.style.bottom = this.applyFilters(newBottom) + 'px'

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

      // flag that we are resizing
      this.resizing = true

      // find out the orientations of the resize
      this.resizeV = e.target.dataset.resizeV ? e.target.dataset.resizeV : false
      this.resizeH = e.target.dataset.resizeH ? e.target.dataset.resizeH : false

      // save the coords of the down event
      this.resizeDownCoords = {
        x: e.clientX,
        y: e.clientY
      }

      // calculate and store the dimensions of the resizing area at the beginning
      const areaStart = {
        left: parseInt(this.pickAreaElement.style.left.replace('px', ''), 10),
        top: parseInt(this.pickAreaElement.style.top.replace('px', ''), 10),
        right: parseInt(this.pickAreaElement.style.right.replace('px', ''), 10),
        bottom: parseInt(this.pickAreaElement.style.bottom.replace('px', ''), 10)
      }

      // save the dimensions of the elements to be resized in the beginning
      const pickStart = this.pick.map((element) => {
        return {
          left: parseInt(element.style.left.replace('px', ''), 10),
          top: parseInt(element.style.top.replace('px', ''), 10),
          right: parseInt(element.style.right.replace('px', ''), 10),
          bottom: parseInt(element.style.bottom.replace('px', ''), 10)
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

            element.style[start] = Math.round(newStart) + 'px' // add filtering/grid here

            // calculate new end position
            const pctEnd = (pickStart[i][end] - areaStart[end]) / areaStartMag
            const newEnd = pickAreaEnd + (newAreaMag * pctEnd)

            element.style[end] = newEnd + 'px' // add filtering/grid here
          })
          this.pickAreaElement.style[end] = Math.round(pickAreaEnd) + 'px'

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

            element.style[start] = newStart + 'px' // add filtering/grid here

            // calculate new end position
            const pctEnd = (pickStart[i][end] - areaStart[end]) / areaStartMag
            const newEnd = areaStart[end] + (newAreaMag * pctEnd)

            element.style[end] = newEnd + 'px' // add filtering/grid here
          })

          this.pickAreaElement.style[start] = pickAreaStart + 'px'

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

        this.pickAreaElement.style.opacity = 0

        const zoomScale = this.appReference.zoomScale

        const viewportDim = this.appReference.workspace.viewportDim

        const proportions = {
          x: null,
          y: null
        }

        // const filteredCoords = coordsFilterFn({ left: e.clientX, top: e.clientY }, this.appReference.gridActive, this.appReference.gridSize, this.appReference.zoomScale, false);

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

        this.resizeV && resizeFunctions[this.resizeV](e, proportions)
        this.resizeH && resizeFunctions[this.resizeH](e, proportions)
      }

      // the stop resize function that clears event listeners and resets the flags
      const stopResize = (e) => {
        e.preventDefault()
        e.stopPropagation()

        this.pickAreaElement.style.opacity = 1

        this.resizing = false
        this.resizeV = null
        this.resizeH = null
        this.resizeDownCoords = null
        document.removeEventListener('mousemove', resize)
        document.removeEventListener('touchmove', resize)
        document.removeEventListener('mouseup', stopResize)
        document.removeEventListener('touchend', stopResize)
      }

      // the event listerners for the subsequent move and mouseup events
      document.addEventListener('mouseup', stopResize)
      document.addEventListener('touchend', stopResize)
      document.addEventListener('mousemove', resize)
      document.addEventListener('touchmove', resize)
    }

    this.toolInit = (app) => {
      // do stuff on initialization
      const ws = app.workspace
      this.appReference = app

      // create the pick area
      this.pickAreaElement = document.createElement('div')
      this.pickAreaElement.classList.add('editor-workspace-pa')

      const paStyles = document.createElement('style')
      paStyles.innerHTML = CssPa
      this.pickAreaElement.appendChild(paStyles)

      this.paNW = document.createElement('div')
      this.paNW.setAttribute('class', 'editor-workspace-pa-handle nw')
      this.paNW.dataset.resizeV = 'n'
      this.paNW.dataset.resizeH = 'w'
      this.paNW.addEventListener('mousedown', this.startResize)
      this.pickAreaElement.appendChild(this.paNW)

      this.paN = document.createElement('div')
      this.paN.setAttribute('class', 'editor-workspace-pa-handle n')
      this.paN.dataset.resizeV = 'n'
      this.paN.addEventListener('mousedown', this.startResize)
      this.pickAreaElement.appendChild(this.paN)

      this.paNE = document.createElement('div')
      this.paNE.setAttribute('class', 'editor-workspace-pa-handle ne')
      this.paNE.dataset.resizeV = 'n'
      this.paNE.dataset.resizeH = 'e'
      this.paNE.addEventListener('mousedown', this.startResize)
      this.pickAreaElement.appendChild(this.paNE)

      this.paW = document.createElement('div')
      this.paW.setAttribute('class', 'editor-workspace-pa-handle w')
      this.paW.dataset.resizeH = 'w'
      this.paW.addEventListener('mousedown', this.startResize)
      this.pickAreaElement.appendChild(this.paW)

      this.paE = document.createElement('div')
      this.paE.setAttribute('class', 'editor-workspace-pa-handle e')
      this.paE.dataset.resizeH = 'e'
      this.paE.addEventListener('mousedown', this.startResize)
      this.pickAreaElement.appendChild(this.paE)

      this.paSW = document.createElement('div')
      this.paSW.setAttribute('class', 'editor-workspace-pa-handle sw')
      this.paSW.dataset.resizeV = 's'
      this.paSW.dataset.resizeH = 'w'
      this.paSW.addEventListener('mousedown', this.startResize)
      this.pickAreaElement.appendChild(this.paSW)

      this.paS = document.createElement('div')
      this.paS.setAttribute('class', 'editor-workspace-pa-handle s')
      this.paS.dataset.resizeV = 's'
      this.paS.addEventListener('mousedown', this.startResize)
      this.pickAreaElement.appendChild(this.paS)

      this.paSE = document.createElement('div')
      this.paSE.setAttribute('class', 'editor-workspace-pa-handle se')
      this.paSE.dataset.resizeV = 's'
      this.paSE.dataset.resizeH = 'e'
      this.paSE.addEventListener('mousedown', this.startResize)
      this.pickAreaElement.appendChild(this.paSE)

      ws._canvas.appendChild(this.pickAreaElement)

      ws && ws.activateSelection()
    }
    this.toolDestroy = (app) => {
      const ws = app.workspace
      ws._canvas.removeChild(this.pickAreaElement)
      this.pickAreaElement = null
      // do stuff on destruction
    }
    this.inputStart = (e) => {
      const element = this.getCompElement(e.detail.mouseEvent.path)
      const shiftKey = e.detail.mouseEvent.shiftKey
      //   const ctrlKey = e.detail.mouseEvent.ctrlKey
      //   const altKey = e.detail.mouseEvent.altKey

      this.inputStartPos = {
        x: e.detail.mouseEvent.clientX,
        y: e.detail.mouseEvent.clientY
      }

      this.modTask = this.getModTask(e.detail.mouseEvent.path)

      if (shiftKey) {
        this.isAdding = true
        if (element) {
          this.pickRegister(element)
        }
      } else {
        this.isAdding = false
        if (element) {
          this.pickRegister(element)
        } else {
          this.deselectAll()
          this.firePickChangeEvent();
        }
      }
    }
    this.inputMove = (e) => {
      const shiftKey = e.detail.mouseEvent.shiftKey
      //   const ctrlKey = e.detail.mouseEvent.ctrlKey
      //   const altKey = e.detail.mouseEvent.altKey
      if (!this.pickAreaHidden) {
        this.pickAreaElement.style.opacity = 0
      }

      if (shiftKey) {
        this.constrainAngle = true
      } else {
        this.constrainAngle = false
      }

      this.pick.forEach((element, i) => {
        this.modTasks[this.modTask](element, i, e)
      })
      this.resizePickArea()
    }
    this.inputEnd = (e) => {
      this.moveIncrementX = null
      this.moveIncrementY = null

      if (this.pick.length > 0) {
        this.pickAreaElement.style.opacity = 1
        this.pickAreaHidden = false
      }
    }
    this.onToolReady = () => {
      this.app.registerKeyDownShortcut({
        key: 'Escape',
        action: () => {
          this.dispatchEvent(new CustomEvent('toolChange', { detail: this, bubbles: true, composed: true }))
        }
      })

      this.app.registerKeyDownShortcut({
        key: 'Delete',
        action: () => {
          this.pick.forEach((element) => {
            this.app.workspace.removeElement(element)
          })
          this.deselectAll()

          // store the doc
          this.app.storeDocument()
        }
      })

      this.app.addEventListener('selectPickAdd', (e) => {
        const elementsToPick = e.detail;
        elementsToPick.forEach((element) => {
          this.pickRegister(element)
        })

        this.pickAreaElement.style.opacity = 1
        this.pickAreaHidden = false
      })
    }
  }
}

export default ToolSelect
