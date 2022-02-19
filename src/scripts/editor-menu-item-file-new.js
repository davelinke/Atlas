import EditorMenuItem from './editor-menu-item.js'

/**
 * The editor menu item file new
 * @extends EditorMenuItem
 * @example
 * <editor-menu-item-file-new></editor-menu-item-file-new>
 * 
 * TODO:
 * verify if the current file is stored or saved if not, ask the user if he wants to save it
 * 
 * create a modal not to have the native prompt
 */

class EditorMenuItemFileNew extends EditorMenuItem {
  constructor () {
    super()
    this._button.innerHTML = this.echo('New')
    this._button.addEventListener('click', () => {
      const createNew = window.confirm('Are you sure you want to create a new file?')
      if (createNew) {
        this.app.workspace.loadDocumentHTML('')
      }
    })
  }
}

export default EditorMenuItemFileNew
