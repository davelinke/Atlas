import EditorMenuItem from './editor-menu-item.js'
// import { LoadParticles } from "./lib-loader.js";

export default class EditorMenuItemObjectRemove extends EditorMenuItem {
  /**
     * the button constructor
     */
  constructor () {
    super()
    this._button.innerHTML = this.echo('Remove')
    this._button.addEventListener('click', () => {

    })
  }
}

//ADD HANDSHAKE AND PICK REOGNITION