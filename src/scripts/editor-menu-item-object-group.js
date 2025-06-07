import EditorMenuItem from './editor-menu-item.js'
import { fireEvent } from './lib-events.js'

export default class EditorMenuItemObjectGroup extends EditorMenuItem {
  constructor () {
    super()
    this.app = null
    this.pick = []

    this.setPick = (e) => {
      this.pick = e.detail
    }

    this.groupPick = () => {
      if (this.pick.length > 1) {
        const group = this.app.workspace.groupElements(this.pick)
        if (group) {
          fireEvent(this, 'toolsSelectPickSet', [group])
          this.app.storeDocument()
        }
      }
    }

    this.onHandShake = (app) => {
      this.app = app
      this.app.addEventListener('pickChange', this.setPick)
      this.app.registerKeyDownShortcut({
        key: 'g',
        action: this.groupPick
      })
    }

    this._button.innerHTML = this.echo('Group')
    this._button.addEventListener('click', this.groupPick)
  }

  connectedCallback () {
    fireEvent(this, 'handShake', this)
  }
}
