const Css = `
:host{
    display:inline-block;
    position:relative;
}

slot{
    display:block;
    position:absolute;
    opacity:0;
    pointer-events:none;
}
`

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 1,
  opacity: 0,
  pointerEvents: 'none',
  padding: '42px',
  boxSizing: 'border-box'
}

const overlayStyle = {
  position: 'relative',
  backgroundColor: 'var(--ptc-modal-overlay-bg-color, var(--ptc-3d-element-bg-color, #fff))',
  boxShadow: 'var(--ptc-modal-overlay-box-shadow, var(--ptc-3d-element-box-shadow, 0 2px 3px rgba(0,0,0,0.25)))'
}

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  insetInlineEnd: '10px',
  width: '40px',
  height: '40px',
  background: 'none',
  border: 'none',
  fontSize: '2.5rem',
  color: 'var(--ptc-modal-close-button-color, var(--ptc-cta-color-primary, deepskyblue))',
  cursor: 'pointer'
}

class PtcModal extends HTMLElement {

  constructor () {
    super()

    this._modalElement = null
    this._contentArea = null
    this._contentViewport = null
    this._contentHeader = null
    this._contentFooter = null
    this._contentMain = null
    this._contentMuttion = null

    this._scrollable = false

    this._attrChangeMethods = {
      open: (newValue, oldValue) => {
        if (newValue === null) {
          this._close()
        } else {
          this._open()
        }
      },
      'aria-label': (newValue, oldValue) => { }
    }

    Object.defineProperty(this, 'open', {
      get: () => {
        return this.getAttribute('open') !== null
      },
      set: (val) => {
        if (val) {
          this.setAttribute('open', '')
        } else {
          this.removeAttribute('open')
        }
      }
    })
    this.open = this.getAttribute('open') !== null

    this.ariaLabel = this.getAttribute('aria-label')
    if (!this.ariaLabel) {
      this.ariaLabel = null
    }

    this._updateContent = () => {
      const slotRef = this._overlayMain
      slotRef.innerHTML = ''
      const realSlot = this._slot
      const slotChildren = realSlot.assignedNodes()
      slotChildren.forEach(node => {
        const clone = node.cloneNode(true)
        slotRef.appendChild(clone)
      })
    }

    this._open = () => {
      this._backdrop.style.opacity = 1
      this._backdrop.style.pointerEvents = 'auto'
    }

    this._close = () => {
      this._backdrop.style.opacity = 0
      this._backdrop.style.pointerEvents = 'none'
    }

    // attach shadow dom
    this._shadow = this.attachShadow({ mode: 'open' })

    const styles = document.createElement('style')
    styles.innerHTML = Css
    this._shadow.appendChild(styles)

    // backdrop
    this._backdrop = document.createElement('div')
    Object.keys(backdropStyle).forEach(key => {
      this._backdrop.style[key] = backdropStyle[key]
    })
    this._backdrop.addEventListener('click', () => {
      this.open = false
    })

    // overlay
    this._overlay = document.createElement('div')
    Object.keys(overlayStyle).forEach(key => {
      this._overlay.style[key] = overlayStyle[key]
    })
    this._backdrop.appendChild(this._overlay)

    // close button
    this._closeButton = document.createElement('button')
    this._closeButton.innerHTML = '&times;'
    Object.keys(closeButtonStyle).forEach(key => {
      this._closeButton.style[key] = closeButtonStyle[key]
    })
    this._closeButton.addEventListener('click', () => {
      this.open = false
    })
    this._overlay.appendChild(this._closeButton)

    this._overlayMain = document.createElement('div')
    this._overlayMain.classList.add('ccs-modal-overlay-main')
    this._overlay.appendChild(this._overlayMain)

    // main slot
    this._slot = document.createElement('slot')
    this._shadow.append(this._slot)

    // insert as last child of the dom
    document.body.appendChild(this._backdrop)
  }

  // ATTRIBUTE CHANGE METHODS

  static get observedAttributes () { return ['open', 'aria-label'] }

  attributeChangedCallback (name, oldValue, newValue) {
    if (this._attrChangeMethods[name]) {
      this._attrChangeMethods[name](newValue, oldValue)
    }
  }

  // LIFECYCLE METHODS

  async connectedCallback () {
    this._slot.addEventListener('slotchange', () => {
      this._updateContent()
    })
  }
}

export default PtcModal
