import EditorElement from './editor-element.js'

class EditorGroup extends EditorElement {
  constructor () {
    super()
    this.setType('group')
  }
}

export default EditorGroup
