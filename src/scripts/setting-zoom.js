import { fireEvent } from './lib-events.js'

const Css = `
input{
    margin: 4px;
    border: 1px solid var(--input-border-color, #ccc);
    border-radius: 3px;
    height: 41px;
    box-sizing: border-box;
    background-color: #fff;
    font-size: 1rem;
    line-height: 1rem;
    padding: 0 0 0 8px;
}
`

class SettingZoom extends HTMLElement {
  constructor () {
    super()

    // STATE

    this.zoomInput = null

    // METHODS

    this.onZoomChange = (e) => {
      this.zoomInput.value = e.detail * 100
    }

    this.onHandShake = (app) => {
      this.app = app
      const currentZoom = app._zoomScale
      this.onZoomChange({ detail: currentZoom })
      this.app.addEventListener('zoomChange', this.onZoomChange)
    }

    // attach shadow dom
    this._shadow = this.attachShadow({ mode: 'open' })

    const styles = document.createElement('style')
    styles.innerHTML = Css
    this._shadow.appendChild(styles)

    const zoomInput = document.createElement('input')

    this.zoomInput = zoomInput

    zoomInput.setAttribute('type', 'number')
    zoomInput.setAttribute('min', '5')
    zoomInput.setAttribute('max', '5000')
    zoomInput.setAttribute('step', '5')
    zoomInput.setAttribute('value', '100')

    zoomInput.addEventListener('focus', (e) => {
      fireEvent(this, 'toggleKeyboardShortcuts', false)
    })

    zoomInput.addEventListener('blur', (e) => {
      fireEvent(this, 'toggleKeyboardShortcuts', true)
    })

    zoomInput.addEventListener('change', (e) => {
      const zoom = e.target.value / 100
      fireEvent(this, 'setZoom', zoom)
    })

    this._shadow.appendChild(zoomInput)
  }

  connectedCallback () {
    fireEvent(this, 'handShake', this)
  }
}

export default SettingZoom
