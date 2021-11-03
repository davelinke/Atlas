import EditorMenuItem from './editor-menu-item.js'
import { fireEvent } from './lib-events.js'

export default class EditorMenuItemObjectRemove extends EditorMenuItem {
  /**
     * the button constructor
     */
  constructor() {
    super()

    // STATE
    
    this.app = null; // will be set on handshake

    this.pick = []; // will be set on pickChange

    // METHODS

    this.setPick = (e) => {
      this.pick = e.detail;
    }

    this.removePick = () => {

      this.pick.forEach((element) => {
        this.app.workspace.removeElement(element)
      })
      // this.deselectAll()

      // store the doc
      this.app.storeDocument()
    }

    this.onHandShake = (app) => {

      this.app = app;

      this.app.addEventListener('pickChange', this.setPick);
  
      this.app.registerKeyDownShortcut({
        key: 'Delete',
        action: this.removePick
      })

    }

    // STRUCTURE

    this._button.innerHTML = this.echo('Remove')
    this._button.addEventListener('click', this.removePick)
  }

  connectedCallback() {
    fireEvent(this, 'handShake', this);
  }
}

//ADD HANDSHAKE AND PICK REOGNITION