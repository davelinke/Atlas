import EditorMenuItem from './editor-menu-item.js'
import { fireEvent } from './lib-events.js'
import "./lib-fabric-smart-object.js"

export default class EditorMenuItemSmartGuides extends EditorMenuItem {
  /**
     * the button constructor
     */
  constructor() {
    super()

    // STATE

    this.app = null // will be set on handshake

    this.active = true
    this.added = false

    this.adding = false
    this.addedObject = null

    this.handlers = {
      // object: ["added", "moving", "moved", "scaled", "selected", "over"],
      // mouse: ["down", "up", "moving", "over", "out"]
      object: {
        moving: (e) => {
          this.moveSnap(e)
        },
        moved: (e) => {
          // Add the smart guides around the object
          const obj = e.target;
          if (!(obj instanceof fabric.Rect)) return false;
          this.drawObjectGuides(obj);
        },
        scaling: (e) => {
          this.scaleSnap(e)
        },
        scaled: (e) => {
          const obj = e.target;
          if (!(obj instanceof fabric.Rect)) return false;
          this.drawObjectGuides(obj);
        },
        modified: (e) => {
          console.log('modified',e)
          const obj = e.target;
          if (!(obj instanceof fabric.Rect)) return false;
          this.drawObjectGuides(obj);
        },
        added: (e) => {
          this.adding = true;
          this.addedObject = e.target;
        }
      },
      mouse: {
        up: (e) => {
          console.log('mouseup',e, this.addedObject===e.target)
          this.drawObjectGuides(this.addedObject);
          this.adding = false;
          this.addedObject = null;
        }
      }
    }

    // METHODS

    this.bindEvents = () => {
      if (this.active) {
        for (let eventType in this.handlers) {
          for (let event in this.handlers[eventType]) {
            console.log('binding', eventType, event)
            this.canvas.on(`${eventType}:${event}`, this.handlers[eventType][event]);
          }
        }
      }
    }

    this.scaleSnap = (e)=>{
      const drag = e.target;
      const transDir = e.transform.corner;
      console.log(transDir)

      if (!(drag instanceof fabric.SnappyRect)) return false;

      this.drawSideGuides(drag, transDir);

      /**
        Implement edge detection here
      */

      // Loop through each object in canvas

      const canvasObjects = this.canvas
        .getObjects()
        .filter(o => o.type !== "line" && o !== drag);
      // var {bl,br,tl,tr} = drag.oCoords
      const matches = new Set();

      for (let canvasObject of canvasObjects){
        var axis, newPos;

        if (transDir==='mt'){
          const side = 'top';
          axis = side;
          newPos = canvasObject.guides[side][axis];

          if (this.inRange(drag.guides["top"][axis], canvasObject.guides["bottom"][axis])) {
            matches.add(side);
            this.snapObject(drag, axis, canvasObject.guides["bottom"][axis]);
          }

          if (this.inRange(drag.guides["top"][axis], canvasObject.guides["top"][axis])) {
            matches.add(side);
            this.snapObject(drag, axis, canvasObject.guides["top"][axis]);
          }

        }

        if (transDir==='mb'){
          const side = 'bottom';
          axis = 'top';
          newPos = canvasObject.guides[side][axis];

          if (this.inRange(drag.guides["bottom"][axis], canvasObject.guides["bottom"][axis])) {
            matches.add(side);
            this.snapObject(drag, axis, canvasObject.guides["bottom"][axis]);
          }

          if (this.inRange(drag.guides["bottom"][axis], canvasObject.guides["top"][axis])) {
            matches.add(side);
            this.snapObject(drag, axis, canvasObject.guides["top"][axis]);
          }

        }
      }

      for (var match of matches) {
        drag.guides[match].set("opacity", 1);
      }

      drag.setCoords();
    }

    this.moveSnap = (e)=>{
      const drag = e.target;

      if (!(drag instanceof fabric.SnappyRect)) return false;

      this.drawObjectGuides(drag);

      /**
        Implement edge detection here
      */

      // Loop through each object in canvas

      const objects = this.canvas
        .getObjects()
        .filter(o => o.type !== "line" && o !== drag);
      // var {bl,br,tl,tr} = drag.oCoords
      const matches = new Set();

      for (var otherObject of objects) {

        for (var side in drag.guides) {
          var axis, newPos;

          switch (side) {
            case "right":
              axis = "left";
              newPos = otherObject.guides[side][axis] - drag.getScaledWidth();
              break;
            case "bottom":
              axis = "top";
              newPos = otherObject.guides[side][axis] - drag.getScaledHeight();
              break;
            case "centerX":
              axis = "left";
              newPos = otherObject.guides[side][axis] - drag.getScaledWidth() / 2;
              break;
            case "centerY":
              axis = "top";
              newPos = otherObject.guides[side][axis] - drag.getScaledHeight() / 2;
              break;
            default:
              axis = side;
              newPos = otherObject.guides[side][axis];
              break;
          }

          if (this.inRange(drag.guides[side][axis], otherObject.guides[side][axis])) {
            matches.add(side);
            this.snapObject(drag, axis, newPos);
          }

          if (side === "left") {
            if (this.inRange(drag.guides["left"][axis], otherObject.guides["right"][axis])) {
              matches.add(side);
              this.snapObject(drag, axis, otherObject.guides["right"][axis]);
            }
          } else if (side === "right") {
            if (this.inRange(drag.guides["right"][axis], otherObject.guides["left"][axis])) {
              matches.add(side);
              this.snapObject(drag, axis, otherObject.guides["left"][axis] - drag.getScaledWidth());
            }
          } else if (side === "top") {
            if (this.inRange(drag.guides["top"][axis], otherObject.guides["bottom"][axis])) {
              matches.add(side);
              this.snapObject(drag, axis, otherObject.guides["bottom"][axis]);
            }
          } else if (side === "bottom") {
            if (this.inRange(drag.guides["bottom"][axis], otherObject.guides["top"][axis])) {
              matches.add(side);
              this.snapObject(drag, axis, otherObject.guides["top"][axis] - drag.getScaledHeight());
            }
          } else if (side === "centerX") {
            if (this.inRange(drag.guides["centerX"][axis], otherObject.guides["left"][axis])) {
              matches.add(side);
              this.snapObject(
                drag,
                axis,
                otherObject.guides["left"][axis] - drag.getScaledWidth() / 2
              );
            } else if (
              this.inRange(drag.guides["centerX"][axis], otherObject.guides["right"][axis])
            ) {
              matches.add(side);
              this.snapObject(
                drag,
                axis,
                otherObject.guides["right"][axis] - drag.getScaledWidth() / 2
              );
            }
          } else if (side === "centerY") {
            if (this.inRange(drag.guides["centerY"][axis], otherObject.guides["top"][axis])) {
              matches.add(side);
              this.snapObject(
                drag,
                axis,
                otherObject.guides["top"][axis] - drag.getScaledHeight() / 2
              );
            } else if (
              this.inRange(drag.guides["centerY"][axis], otherObject.guides["bottom"][axis])
            ) {
              matches.add(side);
              this.snapObject(
                drag,
                axis,
                otherObject.guides["bottom"][axis] - drag.getScaledHeight() / 2
              );
            }
          }
        }
      }

      for (var k of matches) {
        drag.guides[k].set("opacity", 1);
      }

      drag.setCoords();
    }

    this.drawGuide = (side, pos, obj) => {
      var ln;
      var color = "rgb(178, 207, 255)";
      var lineProps = {
        left: 0,
        top: 0,
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 0
      };
      switch (side) {
        case "top":
          ln = new fabric.Line(
            [0, 0, this.canvas.width, 0],
            Object.assign(lineProps, {
              left: 0,
              top: pos
            })
          );
          break;
        case "bottom":
          ln = new fabric.Line(
            [0, 0, this.canvas.width, 0],
            Object.assign(lineProps, {
              left: 0,
              top: pos
            })
          );
          break;

        case "centerY":
          ln = new fabric.Line(
            [0, 0, this.canvas.width, 0],
            Object.assign(lineProps, {
              left: 0,
              top: pos
            })
          );
          break;

        case "left":
          ln = new fabric.Line(
            [0, this.canvas.height, 0, 0],
            Object.assign(lineProps, {
              left: pos,
              top: 0
            })
          );
          break;
        case "right":
          ln = new fabric.Line(
            [0, this.canvas.height, 0, 0],
            Object.assign(lineProps, {
              left: pos,
              top: 0
            })
          );
          break;
        case "centerX":
          ln = new fabric.Line(
            [0, this.canvas.height, 0, 0],
            Object.assign(lineProps, {
              left: pos,
              top: 0
            })
          );
          break;
      }

      if (obj.guides[side] instanceof fabric.Line) {
        // remove the line
        this.canvas.remove(obj.guides[side]);
        delete obj.guides[side];
      }
      obj.guides[side] = ln;
      this.canvas.add(ln).renderAll();
      this.canvas.moveTo(ln, 0);
    }

    // If the 2 different coordinates are in range
    this.inRange = (a, b) => {
      return Math.abs(a - b) <= this.app.snapThreshold;
    }

    this.snapObject = (obj, side, pos) => {
      obj.set(side, pos);
      obj.setCoords();
      this.drawObjectGuides(obj);
    }

    this.drawSideGuides = (obj, transDir) => {
      const w = obj.getScaledWidth();
      const h = obj.getScaledHeight();
      if (transDir==="mt"){
        this.drawGuide("top", obj.top, obj);
      }
      obj.setCoords();
    }

    this.drawObjectGuides = (obj) => {
      const w = obj.getScaledWidth();
      const h = obj.getScaledHeight();
      this.drawGuide("top", obj.top, obj);
      this.drawGuide("left", obj.left, obj);
      this.drawGuide("centerX", obj.left + w / 2, obj);
      this.drawGuide("centerY", obj.top + h / 2, obj);
      this.drawGuide("right", obj.left + w, obj);
      this.drawGuide("bottom", obj.top + h, obj);
      obj.setCoords();
    }


    this.onHandShake = (app) => {
      this.app = app

      this.canvas = app.canvas

      this.bindEvents();

      /*
      this.app.addEventListener('pickChange', this.setPick)

      this.app.registerKeyDownShortcut({
        key: 'Delete',
        action: this.removePick
      })
      */
    }

    // STRUCTURE

    this._button.innerHTML = this.echo('Smart guides')
    this._button.addEventListener('click', () => { })
  }

  connectedCallback() {
    fireEvent(this, 'handShake', this)
  }
}

// ADD HANDSHAKE AND PICK REOGNITION
