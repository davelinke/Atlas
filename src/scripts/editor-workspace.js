import { GenerateId } from './lib-strings.js'
import { LoadParticles } from './lib-loader.js'
import { coordsFilterFn } from './lib-filters.js'

const viewportDim = 30000

const propUnitsJs = {
  backgroundPosition: 'px',
  backgroundPositionX: 'px',
  backgroundPositionY: 'px',
  border: 'px',
  borderBottom: 'px',
  borderBottomWidth: 'px',
  borderLeft: 'px',
  borderLeftWidth: 'px',
  borderRadius: 'px',
  borderRight: 'px',
  borderRightWidth: 'px',
  borderSpacing: 'px',
  borderTop: 'px',
  borderTopWidth: 'px',
  borderWidth: 'px',
  bottom: 'px',
  fontSize: 'px',
  fontSizeAdjust: 'px',
  height: 'px',
  left: 'px',
  letterSpacing: 'px',
  lineHeight: 'px',
  margin: 'px',
  marginBottom: 'px',
  marginLeft: 'px',
  marginRight: 'px',
  marginTop: 'px',
  maxHeight: 'px',
  maxWidth: 'px',
  minHeight: 'px',
  minWidth: 'px',
  outline: 'px',
  outlineWidth: 'px',
  padding: 'px',
  paddingBottom: 'px',
  paddingLeft: 'px',
  paddingRight: 'px',
  paddingTop: 'px',
  right: 'px',
  top: 'px',
  width: 'px',
  wordSpacing: 'px',
  transitionDuration: 'ms',
  transitionDelay: 'ms'
}

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
`

class EditorWorkspace extends HTMLElement {
  /**
       * the button constructor
       */
  constructor() {
    super()

    // LOAD DEPENDENCIES

    LoadParticles(['editor-element'])

    // STATE

    this.canvasOffsetLeft = 0
    this.canvasOffsetTop = 0

    this.viewportDim = viewportDim

    // METHODS

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

    this.startInput = (e) => {
      e.stopPropagation()
      e.preventDefault()

      // so any input focused blurs
      this._canvas.focus()
      
      if (e.button === 0) {
        const downEvent = e
        const scale = this.app.zoomScale
        const downEventDetail = this.mouseCoords(downEvent, scale)

        // fire start event listener

        this.dispatchEvent(
          new CustomEvent(
            'workspaceInputStart',
            {
              detail: {
                mouseEvent: e,
                coords: downEventDetail
              },
              bubbles: true,
              composed: true
            }
          )
        )

        const stopInput = () => {
          // fire end event listener
          this.dispatchEvent(
            new CustomEvent(
              'workspaceInputEnd',
              {
                bubbles: true,
                composed: true
              }
            )
          )

          document.removeEventListener('mouseup', stopInput)
          document.removeEventListener('touchend', stopInput)
          document.removeEventListener('mousemove', move)
          document.removeEventListener('touchmove', move)
        }

        const move = (e) => {
          const coords = this.mouseCoords(e, scale)

          const moveEventDetail = {
            mouseEvent: e,
            coords: coords
          }
          // fire move event listener

          this.dispatchEvent(
            new CustomEvent(
              'workspaceInputMove',
              {
                detail: moveEventDetail,
                bubbles: true,
                composed: true
              }
            )
          )
        }

        document.addEventListener('mouseup', stopInput)
        document.addEventListener('touchend', stopInput)
        document.addEventListener('mousemove', move)
        document.addEventListener('touchmove', move)
      }
    }

    this.inputAreaStart = (args) => {
      const ia = this._inputArea
      ia.classList.add(args.variant)
      ia.style.top = `${args.top}px`
      ia.style.left = `${args.left}px`
      ia.style.right = `${args.right}px`
      ia.style.bottom = `${args.bottom}px`
    }
    this.inputAreaResize = (args) => {
      const ia = this._inputArea
      ia.style.top = `${args.top}px`
      ia.style.left = `${args.left}px`
      ia.style.right = `${args.right}px`
      ia.style.bottom = `${args.bottom}px`
    }
    this.inputAreaClear = () => {
      const ia = this._inputArea
      ia.setAttribute('class', 'input-area')
    }

    this.addElement = (props = {}) => {
      const args = {
        ...{
          left: 15000,
          top: 15000,
          right: 14900,
          bottom: 14900,
          backgroundColor: '#fff',
          borderColor: '#000',
          borderWidth: 1,
          borderRadius: 0,
          borderStyle: 'solid',
          zIndex: 1,
          position: 'absolute'
        },
        ...props
      }
      const element = document.createElement('editor-element')

      const elementId = GenerateId()

      element.setAttribute('id', elementId)

      for (const prop in args) {
        const unit = propUnitsJs[prop] ? propUnitsJs[prop] : ''
        element.style[prop] = args[prop] + unit
      }
      this._canvas.appendChild(element)

      this.dispatchEvent(new CustomEvent('editorElementAdded', { detail: element, bubbles: true, composed: true }))

      return element
    }

    this.insertElement = (element, fireEvent = true) => {
      this._canvas.appendChild(element)

      if (fireEvent) {
        this.dispatchEvent(new CustomEvent('editorElementAdded', { detail: element, bubbles: true, composed: true }))
      }
    }

    this.removeElement = (element) => {
      this._canvas.removeChild(element)
    }

    this.canvasOffset = (newLeft, newTop) => {
      const c = this._canvas

      this.canvasOffsetLeft = newLeft
      this.canvasOffsetTop = newTop

      c.style.left = `${newLeft}px`
      c.style.top = `${newTop}px`

      this.dispatchEvent(new CustomEvent('editorCanvasOffset', { detail: { left: newLeft, top: newTop }, bubbles: true, composed: true }))
    }

    this.activateSelection = () => {
      this._canvas.classList.add('selection-active')
    }
    this.deactivateSelection = () => {
      this._canvas.classList.remove('selection-active')
    }

    this.getDocumentHTML = () => {
      // tools to register
      const doc = this._canvas.cloneNode(true)
      doc.querySelectorAll(':not(editor-element').forEach(el => el.remove())
      doc.querySelectorAll('editor-element[class]').forEach(e => {
        e.removeAttribute('class')
      })
      return doc.innerHTML
    }

    this.clearCanvas = () => {
      this._canvas.querySelectorAll('editor-element').forEach(el => {
        this.removeElement(el)
      })
    }

    this.setSavedWorkspace = () => {

        // set the initial offset
        const storedCanvasOffset = JSON.parse(window.localStorage.getItem('canvasOffset'))
        storedCanvasOffset && this.canvasOffset(storedCanvasOffset.left, storedCanvasOffset.top)

        // set the initial zoom
        const storedZoom = JSON.parse(window.localStorage.getItem('zoomScale'))
        storedZoom && this.dispatchEvent(new CustomEvent('setZoom', { detail: storedZoom, bubbles: true, composed: true }))
    }

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
        this.setSavedWorkspace();
      }

      this.dispatchEvent(new CustomEvent('editorDocumentLoaded', { bubbles: true, composed: true }))

      this.app.storeDocument()
    }

    this.initWorkspace = (app) => {
      this.app = app
      this.app.addEventListener('zoomChange', (e) => {
        // set the transform origin at the center of the viewport
        this._workspace.style.transform = `scale(${this.app.zoomScale})`
      })

      const storedDocument = window.localStorage.getItem('currentDocument')
      storedDocument && this.loadDocumentHTML(storedDocument, true)
    }

    // STRUCTURE

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
    this._canvas.setAttribute('tabindex', '0');

    // get the store document
    this._workspace.appendChild(this._canvas)

    this._inputArea = document.createElement('div')
    this._inputArea.classList.add('input-area')

    this._canvas.appendChild(this._inputArea)

    this._wrapper.append(this._workspace)
  }

  // LIFE CYCLE

  connectedCallback() {
    // scroll to middle if it's not defined
    this._wrapper.scrollLeft = ((viewportDim / 2) - (this.getBoundingClientRect().width / 2))
    this._wrapper.scrollTop = ((viewportDim / 2) - (this.getBoundingClientRect().height / 2))

    // fire up an event to make myself available to the app
    this.dispatchEvent(new CustomEvent('editorWorkspaceReady', { detail: this, bubbles: true, composed: true }))
  }
}

export default EditorWorkspace
