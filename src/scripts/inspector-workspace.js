import { fireEvent } from './lib-events.js'
import { createInput as ci } from './lib-utils.js'

const Css = `
.element-tree-item{
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;
  user-select: none;

}
.picked{
  background-color: var(--inspector-picked-background-color, var(--cta-color-active, #f5f5f5));
}
`
class InspectorWorkspace extends HTMLElement {
  constructor() {
    super()

    /**
     * METHODS
     */

    /**
     * A method to handle when an entanglement is clicked
     */
    this.handleSelection = (e) => {
      const theElement = e.target.actualElement;

      // we send the selection to the selection tool via event.
      fireEvent(this, 'toolsSelectPickAdd', [theElement])
    }

    /**
     * A method to create the entangled inspector element
     */
    this.createEntanglement = (element) => {
      const div = document.createElement('div');
      div.classList.add('element-tree-item');
      div.innerHTML = element.dataset.name
      div.actualElement = element;
      div.addEventListener('click', this.handleSelection)
      div.setAttribute('data-id', element.getAttribute('id'));
      div.setAttribute('data-type', element.getAttribute('type'));
      return div;
    }

    /**
     * A method to build the tree of elements
     */
    this.buildTree = (element, target) => {
      const children = element.querySelectorAll('editor-element');
      for (let i = 0; i < children.length; i++) {
        const div = this.createEntanglement(children[i]);
        target.appendChild(div);
        this.buildTree(children[i], div);
      }
    }

    /**
     * A method to handle the changes in the pick (from outside of the inspector)
     */
    this.pickChange = (e) => {
      const pickElements = [...e.detail];
      const inspectorElements = Array.from(this.scroller.children);
      for (let child of inspectorElements) {
        const isInPick = pickElements.includes(child.actualElement);
        child.classList[isInPick ? 'add' : 'remove']('picked')
        if (isInPick) {
          pickElements.splice(pickElements.indexOf(child.actualElement), 1)
          if (pickElements.length === 0) {
            break;
          }
        }
      }
    }

    /**
     * A method to handle when an element is added to the document
     */
    this.elementAdded = (e) => {
      const actualElement = e.detail;
      const div = this.createEntanglement(actualElement);
      this.scroller.appendChild(div)
    }

    /**
     * A method to handle the handshake with the app
     */
    this.onHandShake = (app) => {
      
      const canvas = app.workspace._canvas
      this.buildTree(canvas, this.scroller)

      app.addEventListener('pickChange', this.pickChange)

      app.addEventListener('editorElementAdded', this.elementAdded)

      //   this.app.addEventListener('canvasModEnd', this.pickModEnd)

      //   this.app.addEventListener('canvasModStart', this.pickModStart)
    }

    // STRUCTURE
    this._shadow = this.attachShadow({ mode: 'open' })

    const styles = document.createElement('style')
    styles.innerHTML = Css
    this._shadow.appendChild(styles)

    const fontawesome = document.createElement('link')
    fontawesome.setAttribute('rel', 'stylesheet')
    fontawesome.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css')
    this._shadow.appendChild(fontawesome)

    this.scroller = document.createElement('div');
    this.scroller.classList.add('scroller')
    this._shadow.appendChild(this.scroller);
  }

  async connectedCallback() {

    fireEvent(this, 'handShake', this)
  }
}

export default InspectorWorkspace
