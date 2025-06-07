import { GenerateId, GenerateName, FixDuplicateName } from './lib-strings.js'
import { LoadParticles } from './lib-loader.js'
import { coordsFilterFn } from './lib-filters.js'
import { fireEvent } from './lib-events.js'
import { propUnitsJs } from './lib-units.js'

/**
 * THE VIEWPORT DIMENSION BOTH IN HEIGHT AND WIDTH
 */
const viewportDim = 30000

/**
 * THE CSS FOR THE WORKSPACE
 */
const Css = `
:host{
    display:block;
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    overflow:hidden;
}

.wrapper{
    width: 100%; 
    height: 100%; 
    overflow: hidden;
}

.workspace{
    width:${viewportDim}px;
    height:${viewportDim}px;
    background-color: var(--workspace-bckground-color, #f9f9f9);
    position:relative;
}

.canvas{
    width:${viewportDim}px;
    height:${viewportDim}px;
    position:absolute;
    top:0;
    left:0;
    pointer-events:none;
}

.canvas.selection-active{
    pointer-events:auto;
}

.input-area{
    border: 1px dotted var(--workspace-input-area-border-color, #ccc);
    position:absolute;
    opacity:0;
    pointer-events:none;
    z-index:10000;
}
.input-area.solid {
    opacity:1;
    border-style:solid;
    background-color: var(--workspace-input-area-solid-background-color, #fff);
}
.input-area.drag-area {
    opacity:1;
    border-style:solid;
    background-color: rgba(0,0,255,0.1);
    border-color: rgba(0,0,255,1);
}
`

class EditorWorkspace extends HTMLElement {
  constructor () {
    super()

    /**
     * LOAD DEPENDENCIES
     */
    LoadParticles(['editor-element'])

    /**
     * THE WORKPSACE STATE
     */

    this.canvasOffsetLeft = 0
    this.canvasOffsetTop = 0

    this.viewportDim = viewportDim

    /**
     * METHODS
     */

    /**
     * a method to get the current mouse position
     */
    this.mouseCoords = (e, scale) => {
      const rect = this._workspace.getBoundingClientRect()

      const left = e.clientX - rect.left // x position within the element.
      const top = e.clientY - rect.top // y position within the element.
      const right = viewportDim - (e.clientX - rect.left)
      const bottom = viewportDim - (e.clientY - rect.top)

      const coords = {
        left,
        top,
        right,
        bottom
      }

      const filteredCoords = coordsFilterFn(coords, this.app.gridActive, this.app.gridSize, this.app.zoomScale, false)

      const returnValue = {
        left: (filteredCoords.left / scale),
        top: (filteredCoords.top / scale),
        right: (filteredCoords.right) / scale,
        bottom: (filteredCoords.bottom) / scale
      }

      return returnValue
    }

    /**
     * a method to register the mouse/touch input start event
     */
    this.startInput = (e) => {
      e.stopPropagation()
      e.preventDefault()

      // so any input focused blurs
      this._canvas.focus()

      if (e.button === 0) { // the principal mouse button (we have to add touch at some point)
        const downEvent = e
        const scale = this.app.zoomScale
        const downEventDetail = this.mouseCoords(downEvent, scale)

        // fire start event listener
        fireEvent(this, 'workspaceInputStart', {
          mouseEvent: e,
          coords: downEventDetail
        })

        // a method that defines what to do when the input stops
        const stopInput = () => {
          // fire end event listener
          const scale = this.app.zoomScale
          const coords = this.mouseCoords(e, scale)

          const upEventDetail = {
            mouseEvent: e,
            coords: coords
          }

          fireEvent(this, 'workspaceInputEnd', upEventDetail)

          document.removeEventListener('mouseup', stopInput)
          document.removeEventListener('touchend', stopInput)
          document.removeEventListener('mousemove', move)
          document.removeEventListener('touchmove', move)
        }

        // a method that defines what to do when the input moves
        const move = (e) => {
          const coords = this.mouseCoords(e, scale)

          const moveEventDetail = {
            mouseEvent: e,
            coords: coords
          }

          // fire move event listener
          fireEvent(this, 'workspaceInputMove', moveEventDetail)
        }

        // register the listeners for the stop and move events
        document.addEventListener('mouseup', stopInput)
        document.addEventListener('touchend', stopInput)
        document.addEventListener('mousemove', move)
        document.addEventListener('touchmove', move)
      }
    }

    /**
     * A method to set the initial style of the input area
     */
    this.inputAreaStart = (args) => {
      const ia = this._inputArea
      ia.classList.add(args.variant)
      ia.style.top = `${args.top}px`
      ia.style.left = `${args.left}px`
      ia.style.right = `${args.right}px`
      ia.style.bottom = `${args.bottom}px`
    }

    /**
     * A method to resize the style of the input area
     */
    this.inputAreaResize = (args) => {
      const ia = this._inputArea
      ia.style.top = `${args.top}px`
      ia.style.left = `${args.left}px`
      ia.style.right = `${args.right}px`
      ia.style.bottom = `${args.bottom}px`
    }

    /**
     * A methood to clear the style of the input area
     */
    this.inputAreaClear = () => {
      const ia = this._inputArea
      ia.setAttribute('class', 'input-area')
    }

    /**
     * A method to add an element to the workspace
     */
    this.addElement = (type = 'element', props = {}, state = 'default') => {
      const args = {
        ...{
          left: 15000,
          top: 15000,
          right: 14900,
          bottom: 14900,
          backgroundColor: '#ffffff',
          borderColor: '#000000',
          borderWidth: 1,
          borderRadius: 0,
          borderStyle: 'solid',
          zIndex: 1,
          position: 'absolute'
        },
        ...props
      }
      const elementTag = type === 'group' ? 'editor-group' : 'editor-element'
      const element = document.createElement(elementTag)

      const elementId = GenerateId()

      const elementName = FixDuplicateName(GenerateName(type), this.getElements().map(e => e.dataset.name))

      element.setAttribute('id', elementId)

      element.currentState = 'default'
      element.setType(type)
      element.setName(elementName)
      element.setState('default', args)

      for (const prop in args) {
        const unit = propUnitsJs[prop] ? propUnitsJs[prop] : ''
        element.style[prop] = args[prop] + unit
      }
      this._canvas.appendChild(element)

      fireEvent(this, 'editorElementAdded', element)

      return element
    }

    /**
     * A method to remove an element to the workspace
     */
    this.removeElement = (element) => {
      fireEvent(this, 'editorElementRemoved', element)
      this._canvas.removeChild(element)
    }

    this.groupElements = (elements) => {
      if (!elements || elements.length === 0) {
        return null
      }
      const viewport = this.viewportDim
      let xMin = null
      let yMin = null
      let xMax = null
      let yMax = null
      elements.forEach(el => {
        const dims = el.getDimensions()
        const x1 = dims.left
        const y1 = dims.top
        const x2 = viewport - dims.right
        const y2 = viewport - dims.bottom
        if (xMin === null || x1 < xMin) { xMin = x1 }
        if (yMin === null || y1 < yMin) { yMin = y1 }
        if (xMax === null || x2 > xMax) { xMax = x2 }
        if (yMax === null || y2 > yMax) { yMax = y2 }
      })

      const width = xMax - xMin
      const height = yMax - yMin

      const group = this.addElement('group', {
        left: xMin,
        top: yMin,
        right: viewport - (xMin + width),
        bottom: viewport - (yMin + height),
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderColor: 'transparent'
      })

      elements.forEach(el => {
        const dims = el.getDimensions()
        const x1 = dims.left
        const y1 = dims.top
        const w = (viewport - dims.right) - x1
        const h = (viewport - dims.bottom) - y1

        const newLeft = x1 - xMin
        const newTop = y1 - yMin
        const newRight = width - (newLeft + w)
        const newBottom = height - (newTop + h)

        el.setProp('left', newLeft)
        el.setProp('top', newTop)
        el.setProp('right', newRight)
        el.setProp('bottom', newBottom)
        group.appendChild(el)
      })

      return group
    }

    /**
     * A method to set the canvas offset
     */
    this.canvasOffset = (newLeft, newTop) => {
      const c = this._canvas

      this.canvasOffsetLeft = newLeft
      this.canvasOffsetTop = newTop

      c.style.left = `${newLeft}px`
      c.style.top = `${newTop}px`

      fireEvent(this, 'editorCanvasOffset', { left: newLeft, top: newTop })
    }

    /**
     * A method to instantiate that something has been selected
     */
    this.activateSelection = () => {
      this._canvas.classList.add('selection-active')
    }

    /**
     * A method to instatniate that something has been deselected
     */
    this.deactivateSelection = () => {
      this._canvas.classList.remove('selection-active')
    }

    /**
     * A method that returns the HTML of the entire document
     */
    this.getDocumentHTML = () => {
      // tools to register
      const doc = this._canvas.cloneNode(true)
      doc.querySelectorAll(':not(editor-element):not(editor-group)').forEach(el => el.remove())
      doc.querySelectorAll('editor-element[class],editor-group[class]').forEach(e => {
        e.removeAttribute('class')
      })
      return doc.innerHTML
    }

    /**
     * A method to clear the canvas
     */
    this.clearCanvas = () => {
      this._canvas.querySelectorAll('editor-element,editor-group').forEach(el => {
        this.removeElement(el)
      })
    }

    /**
     * A method to set the state of the workspace as it was saved
     */
    this.setSavedWorkspace = () => {
      // set the initial offset
      const storedCanvasOffset = JSON.parse(window.localStorage.getItem('canvasOffset'))
      storedCanvasOffset && this.canvasOffset(storedCanvasOffset.left, storedCanvasOffset.top)

      // set the initial zoom
      const storedZoom = JSON.parse(window.localStorage.getItem('zoomScale'))
      storedZoom && fireEvent(this, 'setZoom', storedZoom)
    }

    /**
     * A method to load previously saved HTML into the workspace
     */
    this.loadDocumentHTML = (html, isAutoSave = false) => {
      const canvasHelpers = []
      this._canvas.childNodes.forEach(el => {
        if (el.tagName === 'DIV') {
          canvasHelpers.push(el)
        }
      })

      this._canvas.innerHTML = html

      canvasHelpers.forEach(el => {
        this._canvas.appendChild(el)
      })

      if (!isAutoSave) {
        this.canvasOffset(0, 0)
      } else {
        this.setSavedWorkspace()
      }

      fireEvent(this, 'editorDocumentLoaded', null)

      this.app.storeDocument()
    }

    /**
     * A method to initialize the workspace
     */
    this.initWorkspace = () => {
      this.app.addEventListener('zoomChange', (e) => {
        // set the transform origin at the center of the viewport
        this._workspace.style.transform = `scale(${this.app.zoomScale})`
      })

      const storedDocument = window.localStorage.getItem('currentDocument')
      storedDocument && this.loadDocumentHTML(storedDocument, true)
    }

    /**
     * A method defining what to do on the handshake with the app
     */
    this.onHandShake = (app) => {
      this.app = app
      app.workspace = this
      this.initWorkspace()
    }

    /**
     * A method to return all the elements in the workspace
     */
    this.getElements = () => {
      const elements = Array.from(this._canvas.childNodes)
      return elements.filter(el => {
        return (el.tagName === 'EDITOR-ELEMENT' || el.tagName === 'EDITOR-GROUP')
      })
    }

    /**
     * LET'S CREATE THE WORKSPACE STRUCTURE
     */

    this._shadow = this.attachShadow({ mode: 'open' })

    const styles = document.createElement('style')
    styles.innerHTML = Css
    this._shadow.appendChild(styles)

    this._wrapper = document.createElement('div')
    this._wrapper.classList.add('wrapper')
    this._shadow.append(this._wrapper)

    this._workspace = document.createElement('div')
    this._workspace.classList.add('workspace')

    this._workspace.addEventListener('mousedown', this.startInput)
    this._workspace.addEventListener('touchstart', this.startInput)

    this._canvas = document.createElement('div')
    this._canvas.classList.add('canvas')
    this._canvas.setAttribute('tabindex', '0')

    // get the store document
    this._workspace.appendChild(this._canvas)

    this._inputArea = document.createElement('div')
    this._inputArea.classList.add('input-area')

    this._canvas.appendChild(this._inputArea)

    this._wrapper.append(this._workspace)
  }

  /**
   * A METHOD TO EXECUTE WHEN THE WORKSPACE IS INSTANTIATED IN THE DOM
   */
  connectedCallback () {
    // scroll to middle point of the workspace if it's not defined
    this._wrapper.scrollLeft = ((viewportDim / 2) - (this.getBoundingClientRect().width / 2))
    this._wrapper.scrollTop = ((viewportDim / 2) - (this.getBoundingClientRect().height / 2))

    // fire up the handshake event to make myself available to the app
    fireEvent(this, 'handShake', this)
  }
}

export default EditorWorkspace
