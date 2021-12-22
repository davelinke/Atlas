// fabric is global

const SnappyRect = fabric.util.createClass(fabric.Rect, {
  type: "snappyRect",

  initialize: function(options) {
    options || (options = {});
    this.callSuper("initialize", options);
    this.guides = {};
  },
  _render: function(ctx) {
    this.callSuper("_render", ctx);
  },

  _drawObjectGuides: function(opacity = 1) {
    const w = this.getScaledWidth();
    const h = this.getScaledHeight();
    this._drawGuide("top", this.top, opacity);
    this._drawGuide("left", this.left, opacity);
    this._drawGuide("centerX", this.left + w / 2, opacity);
    this._drawGuide("centerY", this.top + h / 2, opacity);
    this._drawGuide("right", this.left + w, opacity);
    this._drawGuide("bottom", this.top + h, opacity);
    this.setCoords();
  },

  _drawGuide: function(side, pos, opacity = 1) {
    let ln;
    const color = "rgb(178, 207, 255)";
    const lineProps = {
      left: 0,
      top: 0,
      evented: true,
      stroke: color,
      selectable: false,
      opacity: opacity
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

      default:
        break;
    }

    if (this.guides[side] instanceof fabric.Line) {
      // remove the line
      this.canvas.remove(this.guides[side]);
      delete this.guides[side];
    }
    this.guides[side] = ln;
    this.canvas.add(ln);
    this.canvas.moveTo(ln, 0);
  }
});

fabric.SnappyRect = SnappyRect;
