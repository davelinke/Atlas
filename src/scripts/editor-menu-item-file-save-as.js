import EditorMenuItem from './editor-menu-item.js'
// import { LoadParticles } from "./lib-loader.js";

class EditorMenuItemFileSaveAs extends EditorMenuItem {
  constructor () {
    super()

    this._button.innerHTML = this.echo('Save As')
    this._button.addEventListener('click', () => {
      const element = document.createElement('a')
      const fileContents = window.localStorage.getItem('currentDocument')
      let filename = window.localStorage.getItem('currentDocumentName')
      if (!filename) {
        filename = 'document.html'
      }
      element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(fileContents))
      element.setAttribute('download', filename)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    })
  }
}

export default EditorMenuItemFileSaveAs
