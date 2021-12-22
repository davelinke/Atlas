import { fireEvent } from './lib-events.js'

const viewportDim = 30000

const Css = `
editor-workspace {
    display:block;
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    overflow:hidden;
}
/*
.wrapper{
    width: 100%; 
    height: 100%; 
    overflow: hidden;
}

.workspace{
    width:${viewportDim}px;
    height:${viewportDim}px;
    background-color: var(--workspace-bckground-color, #f9f9f9);
    position:relative;
}

.canvas{
    width:${viewportDim}px;
    height:${viewportDim}px;
    position:absolute;
    top:0;
    left:0;
    pointer-events:none;
}

.canvas.selection-active{
    pointer-events:auto;
}

.input-area{
    border: 1px dotted var(--workspace-input-area-border-color, #ccc);
    position:absolute;
    opacity:0;
    pointer-events:none;
    z-index:10000;
}
.input-area.solid {
    opacity:1;
    border-style:solid;
    background-color: var(--workspace-input-area-solid-background-color, #fff);
}
.input-area.drag-area {
    opacity:1;
    border-style:solid;
    background-color: rgba(0,0,255,0.1);
    border-color: rgba(0,0,255,1);
}
*/
`

class EditorWorkspace extends HTMLElement {
  /**
       * the button constructor
       */
  constructor() {
    super()


    // STRUCTURE

    const styles = document.createElement('style')
    styles.innerHTML = Css
    this.appendChild(styles)

    this.createCanvas = () => {
      const dims = this.getBoundingClientRect()
      this._canvasElement = document.createElement('canvas');
      this._canvasElement.setAttribute('width', dims.width + 'px');
      this._canvasElement.setAttribute('height', dims.height + 'px');
      this.appendChild(this._canvasElement)
      this.initCanvas()
    }

    this.initCanvas = () => {
      fabric.Object.prototype.noScaleCache = false;
      this.canvas = new fabric.Canvas(this._canvasElement)

      // fire up an event to make myself available to the app
      fireEvent(this, 'handShake', this)
    }

    this.onHandShake = (app) => {
      app.canvas = this.canvas
    }

    this.createCanvas()
  }

  // LIFE CYCLE

  connectedCallback() {

  }
}

export default EditorWorkspace
