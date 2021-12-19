import Tool from './tool.js'
import { filterCoord } from './lib-filters.js'
import { fireEvent } from './lib-events.js'
import "./lib-fabric-smart-object.js"

class ToolRectangle extends Tool {
  /**
       * the button constructor
       */
  constructor() {
    super()

    // PROPS
    this.name = 'rectangle'

    this.iconClass = 'fa-regular fa-square'

    // STATE

    this._inputDown = null

    this._tentativeRectangle = null

    this.app = null

    // METHODS

    this.toolInit = (app) => {
      // do stuff on initialization

      this.app = app
      this.canvas = app.canvas;

      console.log('woot', this.canvas)

      this.canvas.on('mouse:down', (e) => {
        this._inputDown = true;
        const pointer = this.canvas.getPointer(e.e);
        /*
        // REMEMBER THE GRID
        if (gridActive) {
          top = filterCoord(id.top, ws.gridSize)
          left = filterCoord(id.left, ws.gridSize)
          bottom = filterCoord(id.bottom, ws.gridSize)
          right = filterCoord(id.right, ws.gridSize)
        } else {
          top = id.top
          left = id.left
          bottom = id.bottom
          right = id.right
        }
        */
        this.origX = pointer.x;
        this.origY = pointer.y;
        this.rect = new fabric.SnappyRect({
          left: this.origX,
          top: this.origY,
          originX: 'left',
          originY: 'top',
          width: pointer.x - this.origX,
          height: pointer.y - this.origY,
          angle: 0,
          fill: 'rgba(255,0,0,0.5)',
          transparentCorners: false
        });
        this.canvas.add(this.rect);
      })

      this.canvas.on('mouse:move', (e) => {
        if (!this._inputDown) return;
        const pointer = this.canvas.getPointer(e.e);

        /*
        // if the grid is active
        if (this.app.gridActive) {
          // filter the coordinates
          top = filterCoord(top, this.app.gridSize)
          left = filterCoord(left, this.app.gridSize)
          bottom = filterCoord(bottom, this.app.gridSize)
          right = filterCoord(right, this.app.gridSize)
        }
        */

        const left = this.origX > pointer.x ? pointer.x : this.origX;
        this.rect.set({ left: Math.abs(left) });

        const top = this.origY > pointer.y ? pointer.y : this.origY;
        this.rect.set({ top: Math.abs(top) });

        this.rect.set({ width: Math.abs(this.origX - pointer.x) });
        this.rect.set({ height: Math.abs(this.origY - pointer.y) });


        this.canvas.renderAll();
      })

      this.canvas.on('mouse:up', () => {
        this._inputDown = false;

        fireEvent(this, 'toolChange', this.app.toolDefaultInstance)
      });
      
    }
    this.toolDestroy = (app) => {
      // do stuff on destruction
      this.canvas.off('mouse:down');
      this.canvas.off('mouse:move');
      this.canvas.off('mouse:up');
    }

    this.onToolReady = () => {
      this.app.registerKeyDownShortcut({
        key: 'r',
        action: () => {
          fireEvent(this, 'toolChange', this)
        }
      })
    }
  }
}

export default ToolRectangle
