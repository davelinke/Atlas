import EditorMenuItem from './editor-menu-item.js'

class EditorMenuItemFileOpen extends EditorMenuItem {
  constructor () {
    super()
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.html'

    const fileInputStyles = {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      opacity: '0',
      cursor: 'pointer'
    }
    Array.from(Object.keys(fileInputStyles)).forEach(key => {
      fileInput.style[key] = fileInputStyles[key]
    })

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        this.app.workspace.loadDocumentHTML(content)
      }
      reader.readAsText(file)
    })
    this._button.style.position = 'relative'

    this._button.innerHTML = this.echo('Open')
    this._button.appendChild(fileInput)
  }
}

export default EditorMenuItemFileOpen
