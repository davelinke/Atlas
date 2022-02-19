import { fireEvent } from './lib-events.js'
import { createInput as ci } from './lib-utils.js'

const Css = `
.element-tree-item{
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
}
.picked{
  background-color: var(--inspector-picked-background-color, var(--cta-color-active, #f5f5f5));
}
`
class InspectorWorkspace extends HTMLElement {
  constructor() {
    super()

    // STATE
    this.app = null

    this.pickLengthShow = 0

    this.mainHeading = null

    // METHODS

    this.buildTree = (element, target) => {
        const children = element.querySelectorAll('editor-element');
        const createDiv = (element) => {
            const div = document.createElement('div');
            div.classList.add('element-tree-item');
            div.innerHTML = element.dataset.name
            div.setAttribute('data-id', element.getAttribute('id'));
            div.setAttribute('data-type', element.getAttribute('type'));
            return div;
        }
        for (let i = 0; i < children.length; i++) {
            const div = createDiv(children[i]);
            target.appendChild(div);
            this.buildTree(children[i], div);
        }
    }

    this.pickChange = (e) =>{
      const pickElements = e.detail;
      const nextElements = []
      console.log(pickElements)
      pickElements.forEach(element => {
        const id = element.getAttribute('id');
        const nextElement = this.shadowRoot.querySelector(`[data-id="${id}"]`)
        console.log(nextElements)
        nextElements.push(nextElement);
      });
      console.log(nextElements)
      const currentPickedElements = this.shadowRoot.querySelectorAll('.picked');
      currentPickedElements.forEach(element => {
        if (!nextElements.includes(element)) {
          element.classList.remove('picked');
        } else {
          nextElements.splice(nextElements.indexOf(element), 1);
        }
      });
      nextElements.forEach(element => {
        element && element.classList && element.classList.add('picked');
      });
    }

    this.elementAdded = (e) =>{
      console.log(e);
    }

    this.onHandShake = (app) => {
      this.app = app
      const canvas = app.workspace._canvas
      this.buildTree(canvas, this.scroller)

      this.app.addEventListener('pickChange', this.pickChange)
      
      this.app.addEventListener('editorElementAdded', this.elementAdded)

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
