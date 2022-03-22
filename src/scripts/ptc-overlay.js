
import { fireEvent } from './lib-events.js'
const Css = `
:host {
    display: inline-block;
    line-height: 0;
}
:host(.block) {
    display: block;
}
:host(.block) .ptc-overlay__target slot {
    display: block;
}
.ptc-overlay {
    display: flex;
    position: fixed;
    z-index: 999;
}
.ptc-overlay__target {
    display: inline-block;
    linke-height: 0;
}
.ptc-overlay__target.disabled {
    cursor: not-allowed;
    pointer-events: none !important;
}
.ptc-overlay__target > slot {
    display: inline-block;
}
.ptc-overlay.select {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(180deg, var(--ptc-color-ui-highlight, blue) 0%, var(--ptc-color-ui-highlight, blue) 3px, var(--ptc-color-grayscale-white, #fff) 3px, var(--ptc-color-grayscale-white, #fff) 100%);
    border-radius: 3px;
    box-shadow: 0 8px 13px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    min-width: 40px;
    box-sizing: border-box;
    overflow: hidden;
    opacity: 1;
    max-height: 500px;
    transform-origin: top;
}
.ptc-overlay.select > slot {
    display: block;
    width: 100%;
    height: calc(100% - 3px);
    margin-top: 3px;
    opacity: 1;
    overflow: hidden;
}
.ptc-overlay.hidden {
    opacity: 0;
}
.ptc-overlay:not(.hidden) {
}
.ptc-overlay.pp, .ptc-overlay.np {
    transform-origin: bottom;
    align-self: flex-end;
    box-shadow: 0 -8px 13px rgba(0, 0, 0, 0.3);
    background-image: linear-gradient(0deg, var(--ptc-color-ui-highlight, blue) 0%, var(--ptc-color-ui-highlight, blue) 3px, var(--ptc-color-grayscale-white, #fff) 3px, var(--ptc-color-grayscale-white, #fff) 100%);
}
.ptc-overlay.pp > slot, .ptc-overlay.np > slot {
    margin-top: 0;
    margin-bottom: 3px;
}
.popover {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 0;
    box-sizing: border-box;
    overflow: hidden;
    filter: drop-shadow(0 8px 13px rgba(0, 0, 0, 0.3));
   /* EXPLANATION OF NOMENCLATURE When organizing the direction that the overlay has to go the class names were chosen around the positive/negative orientation for each axis therefore, a class name of 'pp' means that the overlay is flowing positively horizontally (to the start) and positively vertically (upwards). This also means that a class name of 'nn' determines that the overlay should open negatively horizontally (to the end) and negatively vertically (downwards). All calsses are build using this logic. */
}
.popover slot {
    display: block;
    position: absolute;
    inset-block-start: 8px;
    inset-inline-start: 0;
    inset-inline-end: 0;
    inset-block-end: 0;
    z-index: 1;
}
.popover::before {
    content: ' ';
    display: block;
    width: 0;
    height: 0;
    border-inline-start: 8px solid transparent;
    border-inline-end: 8px solid transparent;
    border-block-end: 8px solid var(--ptc-color-grayscale-white, #fff);
    margin-inline-start: 1rem;
}
.popover::after {
    content: ' ';
    display: block;
    background-color: var(--ptc-color-grayscale-white, #fff);
    width: 100%;
    height: calc(100% - 8px);
}
.popover.hidden {
    opacity: 0;
    pointer-events: none;
}
.popover.pn::before, .popover.pp::before {
    margin-inline-start: auto;
    margin-inline-end: 1rem;
}
.popover.pp, .popover.np {
    align-self: flex-end;
    flex-flow: column-reverse;
    background-image: none;
}
.popover.pp slot, .popover.np slot {
    inset-block-start: 0;
    inset-block-end: 8px;
}
.popover.pp::before, .popover.np::before {
    transform: scale(-1);
}
@media (max-width: 768px) {
    .ptc-overlay.select, .ptc-overlay.popover {
        inset-block-start: 0 !important;
        inset-inline-start: 0 !important;
        width: 100% !important;
        height: 100vh !important;
        max-height: 100vh !important;
        align-items: center;
        justify-content: center;
        background-color: var(--ptc-color-ui-primary-darkest-alpha-eighty, rgba(0, 0, 100, 0.8));
        pointer-events: none !important;
   }
    .ptc-overlay.select > slot, .ptc-overlay.popover > slot {
        width: calc(100% - 64px);
        max-height: calc(100vh - 64px);
        min-height: 350px;
        min-height: 10px;
        align-self: center;
        pointer-events: all;
        height: auto;
        background-image: linear-gradient(180deg, var(--ptc-color-ui-highlight, blue) 0%, var(--ptc-color-ui-highlight, blue) 3px, var(--ptc-color-grayscale-white, #fff) 3px, var(--ptc-color-grayscale-white, #fff) 100%);
   }
    .ptc-overlay.select.hidden, .ptc-overlay.popover.hidden {
        background-color: transparent;
   }
    .ptc-overlay.select.hidden > slot, .ptc-overlay.popover.hidden > slot {
        pointer-events: none;
   }
    .ptc-overlay.select.nn, .ptc-overlay.popover.nn, .ptc-overlay.select.pn, .ptc-overlay.popover.pn, .ptc-overlay.select.pp, .ptc-overlay.popover.pp, .ptc-overlay.select.np, .ptc-overlay.popover.np {
        background-image: none;
   }
    .ptc-overlay.select slot, .ptc-overlay.popover slot {
        margin-block-end: 0;
        overflow: auto;
        position: relative;
   }
    .ptc-overlay.popover > slot {
        background-image: none;
        background-color: var(--ptc-color-grayscale-white, #fff);
   }
    .ptc-overlay.popover::after {
        display: none;
   }
    .ptc-overlay.popover::before {
        display: none;
   }
}

`

export default class PtcOverlay extends HTMLElement {
  constructor () {
    super()

    this.layer = null
    this.targetElement = null
    this.selectMaxHeight = 500

    this._hidden = true
    this.layerStyle = {}
    this._orientation = 'nn'
    Object.defineProperty(this, 'orientation', {
      get: () => {
        return this._show
      },
      set: (val) => {
        if (val !== this._orientation) {
          this._orientation = val
          this.layer.classList.remove('pp', 'np', 'pn', 'nn')
          this.layer.classList.add(this._orientation)
        }
      }
    })

    this._show = false
    Object.defineProperty(this, 'show', {
      get: () => {
        return this._show
      },
      set: (val) => {
        if (val !== this._show) {
          this._show = val
          if (this._show) {
            this.showOverlay()
          } else {
            this.hideOverlay({
              target: this.targetElement,
              composedPath () {
                return false
              }
            })
          }
        }
      }
    })

    this._width = '300px'
    Object.defineProperty(this, 'width', {
      get: () => {
        return this._width
      },
      set: (val) => {
        if (val !== this._width) {
          this._width = val
          // this.setLayerStyle({ pointerEvents: 'none' });
        }
      }
    })

    this._height = '220px'
    Object.defineProperty(this, 'height', {
      get: () => {
        return this._height
      },
      set: (val) => {
        if (val !== this._height) {
          this._height = val
          // this.setLayerStyle({ pointerEvents: 'none' });
        }
      }
    })

    /**
         * disables overlay toggling on target element click
         */
    this.noToggle = false

    /**
         * disables the overlay funcitonality
         */
    this._disabled = false
    Object.defineProperty(this, 'disabled', {
      get: () => {
        return this._show
      },
      set: (val) => {
        if (val !== this._disabled) {
          this._disabled = val
          this.targetElement.classList[this._disabled ? 'add' : 'remove']('disabled')
        }
      }
    })

    /**
         * Specify whether component should render from right to left
         */
    this.variant = 'popover'

    /**
         * Specify the minWidth of the layer in CSS units
         */
    this.minWidth = '100px'

    /**
         * Specify whether component should render as block or inline element
         */
    this.block = false

    /**
         * Provides an accessible name for the slot content
         */
    this.ariaLabel = null

    /**
         * Forces the overlay to open in a certain direction. Possible values are "ne", "se", "sw" and "nw"
         */
    this.direction = null

    /**
         * Method to toggle the overlay state programatically.
         */
    this.toggle = (e) => {
      this.toggleOverlay(e)
    }

    /**
         * Method to determine if the overlay is shown at a specific moment.
         */
    this.isShown = () => {
      return !this._hidden
    }

    // this function toggles the overlay state
    this.toggleOverlay = e => {
      if (!this.disabled && !this.noToggle) {
        if (this._hidden) {
          return this.showOverlay()
        }
        return this.hideOverlay(e)
      }
    }

    // this funciton shows the overlay
    this.showOverlay = () => {
      setTimeout(() => {
        document.addEventListener('scroll', this.hideOverlay, true)
        window.addEventListener('resize', this.hideOverlay)
        document.addEventListener('click', this.hideOverlay)
      })
      this.positionOverlay()
      const pointerEvents = { pointerEvents: 'all' }
      this.layerStyle = { ...this.layerStyle, ...pointerEvents }
      this._hidden = false
      // set layer style
      for (const [key, value] of Object.entries(this.layerStyle)) {
        this.layer.style[key] = value
      }
      this.setAttribute('aria-hidden', 'false')
      this.setAttribute('aria-expanded', 'true')
      this.layer.classList.remove('hidden')
      fireEvent(this, 'ptcShow', true)
    }

    // this function hides the overlay

    this.hideOverlay = e => {
      // determine if the click is within the content slot that's within the overlay
      const path = e.composedPath()

      // sometimes we send a fake event without composed path when we hide the overlay by prop
      // therefore we force the "clickoutside" by just saying it was outside
      const isWithin = path.includes(this.layer)

      if (!isWithin) {
        document.removeEventListener('scroll', this.hideOverlay, true)
        window.removeEventListener('resize', this.hideOverlay)
        document.removeEventListener('click', this.hideOverlay)
        const pointerEvents = { pointerEvents: 'none' }
        this.layerStyle = { ...this.layerStyle, ...pointerEvents }
        this._hidden = true
        // set layer style
        for (const [key, value] of Object.entries(this.layerStyle)) {
          this.layer.style[key] = value
        }
        this.setAttribute('aria-hidden', 'true')
        this.setAttribute('aria-expanded', 'false')
        this.layer.classList.add('hidden')
        fireEvent(this, 'ptcShow', false)
      }
    }

    this.getOrientation = (key, elementDimensions, layerDimensions) => {
      const formulas = new Map()

      formulas.set('ltr_pn', {
        left: elementDimensions.left + elementDimensions.width - layerDimensions.width + 'px',
        top: elementDimensions.top + elementDimensions.height + 'px'
      })

      formulas.set('ltr_np', {
        left: elementDimensions.left + 'px',
        top: elementDimensions.top - layerDimensions.height + 'px'
      })

      formulas.set('ltr_pp', {
        left: elementDimensions.left + elementDimensions.width - layerDimensions.width + 'px',
        top: elementDimensions.top - layerDimensions.height + 'px'
      })

      formulas.set('ltr_nn', {
        left: elementDimensions.left + 'px',
        top: elementDimensions.top + elementDimensions.height + 'px'
      })

      formulas.set('rtl_pn', {
        left: elementDimensions.left + 'px',
        top: elementDimensions.top + elementDimensions.height + 'px'
      })

      formulas.set('rtl_np', {
        left: elementDimensions.left + elementDimensions.width - layerDimensions.width + 'px',
        top: elementDimensions.top - layerDimensions.height + 'px'
      })

      formulas.set('rtl_pp', {
        left: elementDimensions.left + 'px',
        top: elementDimensions.top - layerDimensions.height + 'px'
      })

      formulas.set('rtl_nn', {
        left: elementDimensions.left + elementDimensions.width - layerDimensions.width + 'px',
        top: elementDimensions.top + elementDimensions.height + 'px'
      })

      return formulas.get(key)
    }

    this.positionOverlay = () => {
      // find position on screen
      const elementDimensions = this.targetElement.getBoundingClientRect()

      // get overlay dimensions
      const layerDimensions = this.layer.getBoundingClientRect()

      // get window width and height
      const windowDimensions = {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }

      // define base overlay style
      const minWidth =
                this.width === 'auto' && this.block ? this.targetElement.getBoundingClientRect().width + 'px' : this.minWidth
      const layerStyle = {
        width: this.layerStyle.width,
        height: layerDimensions.height + 'px',
        left: '',
        top: '',
        pointerEvents: 'all',
        minWidth
      }

      let caseString
      let flow
      let lateralOverflow
      let verticalOverflow

      /*
            EXPLANATION OF NOMENCLATURE

            When organizing the direction that the overlay has to go
            the class names were chosen around the positive/negative orientation for each axis
            therefore, a class name of 'pp' means that the overlay is flowing
            positively horizontally (to the start) and positively vertically (upwards).
            This also means that a class name of 'nn' determines that
            the overlay should open negatively horizontally (to the end) and negatively vertically (downwards).

            All calsses are build using this logic.
            */

      if (this.direction) {
        flow = 'ltr'
        const directionArray = this.direction.split('')

        caseString = (directionArray[1] === 'w' ? 'p' : 'n') + (directionArray[0] === 'n' ? 'p' : 'n')
      } else {
        if (!this.rtl) {
          // calculate if overflows
          lateralOverflow = elementDimensions.left + layerDimensions.width - windowDimensions.width
          verticalOverflow = elementDimensions.top + layerDimensions.height - windowDimensions.height

          // define the overflow scenario for a particular class and the positioning switch
          // display overlay downwards when window heigh is smaller than the overlay
          caseString =
                        windowDimensions.height < layerDimensions.height
                          ? (lateralOverflow > 0 ? 'p' : 'n') + 'n'
                          : (lateralOverflow > 0 ? 'p' : 'n') + (verticalOverflow > 0 ? 'p' : 'n')
          // if (windowDimensions.height < layerDimensions.height) {
          //   caseString = (lateralOverflow > 0 ? 'p' : 'n') + 'n';
          // } else {
          //   caseString = (lateralOverflow > 0 ? 'p' : 'n') + (verticalOverflow > 0 ? 'p' : 'n');
          // }
          flow = 'ltr'
        } else {
          // calculate if overflows
          lateralOverflow = elementDimensions.right - layerDimensions.width
          verticalOverflow = elementDimensions.top + layerDimensions.height - windowDimensions.height

          // define the overflow scenario for a particular class and the positioning switch
          // display overlay downwards when window heigh is smaller than the overlay
          caseString =
                        windowDimensions.height < layerDimensions.height
                          ? (lateralOverflow < 0 ? 'p' : 'n') + 'n'
                          : (lateralOverflow < 0 ? 'p' : 'n') + (verticalOverflow > 0 ? 'p' : 'n')
          // if (windowDimensions.height < layerDimensions.height) {
          //   caseString = (lateralOverflow < 0 ? 'p' : 'n') + 'n';
          // } else {
          //   caseString = (lateralOverflow < 0 ? 'p' : 'n') + (verticalOverflow > 0 ? 'p' : 'n');
          // }
          flow = 'rtl'
        }
      }

      // get the top left values with the orientation string
      const topleft = this.getOrientation(
                `${flow}_${caseString}`,
                elementDimensions,
                layerDimensions
      )

      // assign the new layer style
      this.layerStyle = { ...layerStyle, ...topleft }
      // assign the orientation for custom orientation classes
      this.orientation = caseString
    }

    this.handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        this.hideOverlay({
          target: this.targetElement,
          composedPath () {
            return false
          }
        })
      }
    }

    this.onSlotChange = () => {
      const pointerEvents = this._hidden ? 'none' : 'all'
      this.layerStyle = {
        pointerEvents
      }
      this.setLayerStyle({ pointerEvents })

      // Correct dimensions for variant select
      if (this.variant === 'select') {
        setTimeout(() => {
          this.correctLayerDimensionsOnSelect(pointerEvents)
        }, 100)
      }
    }

    /**
         * Correct overlay dimensions
         * When the component is on its max height, define this height to the component
         * to prevent hiding scrollbar
         */
    this.correctLayerDimensionsOnSelect = (pointerEvents) => {
      const layerDimensions = this.layer.getBoundingClientRect()
      if (layerDimensions.height === this.selectMaxHeight) {
        const correctedDimensions = {
          pointerEvents,
          height: layerDimensions.height + 'px'
        }
        this.setLayerStyle(correctedDimensions)
      }
    }
  }

  setLayerStyle (layerStyles) {
    this.layerStyle = {
      width: this.width,
      height: this.height,
      ...layerStyles
    }

    for (const key in this.layerStyle) {
      (this.layer.style[key] = this.layerStyle[key])
    }
  };

  connectedCallback () {
    for (const a of this.attributes) {
      this[a.name] = a.value
    }

    // rendering
    this.block && this.classList.add('block')
    this.targetElement = document.createElement('div')
    this.targetElement.setAttribute('class', 'ptc-overlay__target' + (this.disabled ? ' disabled' : ''))
    this.targetElement.addEventListener('click', this.toggleOverlay)
    this.targetElement.style.display = (this.block ? 'block' : 'inline-block')
    const targetSlot = document.createElement('slot')
    targetSlot.setAttribute('name', 'target')
    this.targetElement.appendChild(targetSlot)

    this.layer = document.createElement('div')
    this.layer.setAttribute('class', `ptc-overlay ${this.variant} ${this.orientation} ${this._hidden ? 'hidden' : ''}`)
    for (const [key, value] of Object.entries(this.layerStyle)) {
      this.layer.style[key] = value
    }
    this.layer.setAttribute('role', 'dialog')
    this.layer.setAttribute('aria-modal', 'true')
    this.layer.setAttribute('aria-label', this.ariaLabel) // component will load

    this.setLayerStyle({ pointerEvents: 'none' })

    this.contentSlot = document.createElement('slot')
    this.contentSlot.setAttribute('name', 'content')
    this.layer.appendChild(this.contentSlot)

    this._shadow = this.attachShadow({ mode: 'open' })

    const styles = document.createElement('style')
    styles.innerHTML = Css
    this._shadow.appendChild(styles)

    this._shadow.appendChild(this.targetElement)
    this._shadow.appendChild(this.layer)

    if (this.show) {
      this.showOverlay()
    }
    this.contentSlot.addEventListener('slotchange', this.onSlotChange)
  }
}
