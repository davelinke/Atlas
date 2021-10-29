import { GenerateId } from './lib-strings.js'
import { LoadParticles } from './lib-loader.js'

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

// const GenerateSytle = (styles, elementId) => {
//   let style = `#${elementId} {`
//   for (const key in styles) {
//     const cssProp = CamelCaseToDashed(key)
//     const cssValue = styles[key]
//     const unit = propUnitsJs[key] ? propUnitsJs[key] : ''
//     style += `${cssProp}:${cssValue}${unit};`
//   }
//   style += '}'
//   return style
// }

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
  constructor () {
    super()

    // LOAD DEPENDENCIES

    LoadParticles(['editor-element'])

    // STATE

    this._zoomScale = 1

    this._gridSize = 10

    this._gridActive = true

    this.canvasOffsetLeft = 0
    this.canvasOffsetTop = 0

    // PROPS
    Object.defineProperty(this, 'zoomScale', {
      get: () => {
        return this._zoomScale
      },
      set: (val) => {
        if (val !== this._zoomScale) {
          this._zoomScale = val
          this._workspace.style.transform = `perspective(1px) scale(${val})`
        }
      }
    })

    Object.defineProperty(this, 'gridSize', {
      get: () => {
        return this._gridSize
      },
      set: (val) => {
        if (val !== this._gridSize) {
          this._gridSize = val
        }
      }
    })

    Object.defineProperty(this, 'gridActive', {
      get: () => {
        return this._gridActive
      },
      set: (val) => {
        if (val !== this._gridActive) {
          this._gridActive = val
        }
      }
    })

    // EVENT LISTENERS

    // listen for model changes and update local state
    const app = this.closest('editor-app')
    app && app.addEventListener('modelChange', (e) => {
      this.zoomScale = e.detail.zoomScale
    })

    app && app.addEventListener('zoomChange', (e) => {
      // set the transform origin at the center of the viewport
      this.zoomScale = e.detail
    })

    // METHODS

    this.mouseCoords = (e, scale) => {
      const rect = this._workspace.getBoundingClientRect()

      const x = e.clientX - rect.left // x position within the element.
      const y = e.clientY - rect.top // y position within the element.

      const filteredCoords = this.coordsFilterFn(x, y, false)

      const returnValue = {
        x: (filteredCoords.x / scale),
        y: (filteredCoords.y / scale)
      }

      return returnValue
    }

    this.coordsFilterFn = (x, y, isEdit = true) => {
      // snap to grid
      const roundToMultiple = (num, multiple) => {
        return Math.round(num / multiple) * multiple
      }

      let nx = x
      let ny = y

      if (this.gridActive) {
        nx = roundToMultiple(nx, (this.gridSize * this.zoomScale))
        ny = roundToMultiple(ny, (this.gridSize * this.zoomScale))
      }

      const cx = 0
      const cy = 0

      // if (!isEdit) {
      //   // calculate offset of the grid
      //   const a = ((this.viewportDim * this.zoomScale) / 2)
      //   const b = Math.round(((this.viewportDim * this.zoomScale) / 2) / (this.gridSize * this.zoomScale)) * (this.gridSize * this.zoomScale);
      //   cx = a - b;
      //   cy = a - b;
      // }

      return {
        x: nx + cx,
        y: ny + cy
      }
    }

    this.startInput = (e) => {
      e.stopPropagation()
      e.preventDefault()
      if (e.button === 0) {
        const downEvent = e
        const scale = this.zoomScale
        const eventDetail = this.mouseCoords(downEvent, scale)

        // fire start event listener

        this.dispatchEvent(
          new CustomEvent(
            'workspaceInputStart',
            {
              detail: {
                mouseEvent: e,
                coords: eventDetail
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
          const delta = {
            x: e.x - downEvent.x,
            y: e.y - downEvent.y
          }
          const filteredDelta = this.coordsFilterFn(delta.x, delta.y, true)
          const deltaX = filteredDelta.x / scale
          const deltaY = filteredDelta.y / scale

          const eventDetail = {
            mouseEvent: e,
            delta: {
              x: deltaX,
              y: deltaY
            }
          }
          // fire move event listener

          this.dispatchEvent(
            new CustomEvent(
              'workspaceInputMove',
              {
                detail: eventDetail,
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
      ia.style.width = '0'
      ia.style.height = '0'
    }
    this.inputAreaResize = (args) => {
      const ia = this._inputArea
      ia.style.top = `${args.top}px`
      ia.style.left = `${args.left}px`
      ia.style.width = `${args.width}px`
      ia.style.height = `${args.height}px`
    }
    this.inputAreaClear = () => {
      const ia = this._inputArea
      ia.setAttribute('class', 'input-area')
    }

    this.addElement = (props = {}) => {
      const args = {
        ...{
          left: 5000,
          top: 5000,
          width: 100,
          height: 100,
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

      return element
    }

    this.canvasOffset = (newLeft, newTop) => {
      const c = this._canvas

      this.canvasOffsetLeft = newLeft
      this.canvasOffsetTop = newTop

      c.style.left = `${newLeft}px`
      c.style.top = `${newTop}px`
    }

    this.activateSelection = () => {
      this._canvas.classList.add('selection-active')
    }
    this.deactivateSelection = () => {
      this._canvas.classList.remove('selection-active')
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
    this._workspace.style.transform = `scale(${this.zoomScale})`

    this._workspace.addEventListener('mousedown', this.startInput)
    this._workspace.addEventListener('touchstart', this.startInput)

    this._canvas = document.createElement('div')
    this._canvas.classList.add('canvas')
    this._workspace.appendChild(this._canvas)

    this._inputArea = document.createElement('div')
    this._inputArea.classList.add('input-area')

    this._canvas.appendChild(this._inputArea)

    this._wrapper.append(this._workspace)
  }

  // LIFE CYCLE

  connectedCallback () {
    // scroll to middle if it's not defined
    this._wrapper.scrollLeft = ((viewportDim / 2) - (this.getBoundingClientRect().width / 2))
    this._wrapper.scrollTop = ((viewportDim / 2) - (this.getBoundingClientRect().height / 2))

    // fire up an event to make myself available to the app
    this.dispatchEvent(new CustomEvent('editorWorkspaceReady', { detail: this, bubbles: true, composed: true }))

    this.addElement({ top: 15000, left: 15000 })
    this.addElement({ top: 15200, left: 15200 })
  }
}

export default EditorWorkspace
