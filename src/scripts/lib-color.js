// TinyColor v1.4.2
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function (Math) {
  const trimLeft = /^\s+/
  const trimRight = /\s+$/
  const mathRound = Math.round
  const mathMin = Math.min
  const mathMax = Math.max
  const mathRandom = Math.random

  function tinycolor (color, opts) {
    color = (color) || ''
    opts = opts || { }

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
      return color
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
      return new tinycolor(color, opts)
    }

    const rgb = inputToRGB(color)
    this._originalInput = color,
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100 * this._a) / 100,
    this._format = opts.format || rgb.format
    this._gradientType = opts.gradientType

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r) }
    if (this._g < 1) { this._g = mathRound(this._g) }
    if (this._b < 1) { this._b = mathRound(this._b) }

    this._ok = rgb.ok
  }

  tinycolor.prototype = {
    isDark: function () {
      return this.getBrightness() < 128
    },
    isLight: function () {
      return !this.isDark()
    },
    isValid: function () {
      return this._ok
    },
    getOriginalInput: function () {
      return this._originalInput
    },
    getFormat: function () {
      return this._format
    },
    getAlpha: function () {
      return this._a
    },
    getBrightness: function () {
      // http://www.w3.org/TR/AERT#color-contrast
      const rgb = this.toRgb()
      return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    },
    getLuminance: function () {
      // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
      const rgb = this.toRgb()
      let RsRGB, GsRGB, BsRGB, R, G, B
      RsRGB = rgb.r / 255
      GsRGB = rgb.g / 255
      BsRGB = rgb.b / 255

      if (RsRGB <= 0.03928) { R = RsRGB / 12.92 } else { R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4) }
      if (GsRGB <= 0.03928) { G = GsRGB / 12.92 } else { G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4) }
      if (BsRGB <= 0.03928) { B = BsRGB / 12.92 } else { B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4) }
      return (0.2126 * R) + (0.7152 * G) + (0.0722 * B)
    },
    setAlpha: function (value) {
      this._a = boundAlpha(value)
      this._roundA = mathRound(100 * this._a) / 100
      return this
    },
    toHsv: function () {
      const hsv = rgbToHsv(this._r, this._g, this._b)
      return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a }
    },
    toHsvString: function () {
      const hsv = rgbToHsv(this._r, this._g, this._b)
      const h = mathRound(hsv.h * 360); const s = mathRound(hsv.s * 100); const v = mathRound(hsv.v * 100)
      return (this._a == 1)
        ? 'hsv(' + h + ', ' + s + '%, ' + v + '%)'
        : 'hsva(' + h + ', ' + s + '%, ' + v + '%, ' + this._roundA + ')'
    },
    toHsl: function () {
      const hsl = rgbToHsl(this._r, this._g, this._b)
      return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a }
    },
    toHslString: function () {
      const hsl = rgbToHsl(this._r, this._g, this._b)
      const h = mathRound(hsl.h * 360); const s = mathRound(hsl.s * 100); const l = mathRound(hsl.l * 100)
      return (this._a == 1)
        ? 'hsl(' + h + ', ' + s + '%, ' + l + '%)'
        : 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + this._roundA + ')'
    },
    toHex: function (allow3Char) {
      return rgbToHex(this._r, this._g, this._b, allow3Char)
    },
    toHexString: function (allow3Char) {
      return '#' + this.toHex(allow3Char)
    },
    toHex8: function (allow4Char) {
      return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char)
    },
    toHex8String: function (allow4Char) {
      return '#' + this.toHex8(allow4Char)
    },
    toRgb: function () {
      return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a }
    },
    toRgbString: function () {
      return (this._a == 1)
        ? 'rgb(' + mathRound(this._r) + ', ' + mathRound(this._g) + ', ' + mathRound(this._b) + ')'
        : 'rgba(' + mathRound(this._r) + ', ' + mathRound(this._g) + ', ' + mathRound(this._b) + ', ' + this._roundA + ')'
    },
    toPercentageRgb: function () {
      return { r: mathRound(bound01(this._r, 255) * 100) + '%', g: mathRound(bound01(this._g, 255) * 100) + '%', b: mathRound(bound01(this._b, 255) * 100) + '%', a: this._a }
    },
    toPercentageRgbString: function () {
      return (this._a == 1)
        ? 'rgb(' + mathRound(bound01(this._r, 255) * 100) + '%, ' + mathRound(bound01(this._g, 255) * 100) + '%, ' + mathRound(bound01(this._b, 255) * 100) + '%)'
        : 'rgba(' + mathRound(bound01(this._r, 255) * 100) + '%, ' + mathRound(bound01(this._g, 255) * 100) + '%, ' + mathRound(bound01(this._b, 255) * 100) + '%, ' + this._roundA + ')'
    },
    toName: function () {
      if (this._a === 0) {
        return 'transparent'
      }

      if (this._a < 1) {
        return false
      }

      return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false
    },
    toFilter: function (secondColor) {
      const hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a)
      let secondHex8String = hex8String
      const gradientType = this._gradientType ? 'GradientType = 1, ' : ''

      if (secondColor) {
        const s = tinycolor(secondColor)
        secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a)
      }

      return 'progid:DXImageTransform.Microsoft.gradient(' + gradientType + 'startColorstr=' + hex8String + ',endColorstr=' + secondHex8String + ')'
    },
    toString: function (format) {
      const formatSet = !!format
      format = format || this._format

      let formattedString = false
      const hasAlpha = this._a < 1 && this._a >= 0
      const needsAlphaFormat = !formatSet && hasAlpha && (format === 'hex' || format === 'hex6' || format === 'hex3' || format === 'hex4' || format === 'hex8' || format === 'name')

      if (needsAlphaFormat) {
        // Special case for "transparent", all other non-alpha formats
        // will return rgba when there is transparency.
        if (format === 'name' && this._a === 0) {
          return this.toName()
        }
        return this.toRgbString()
      }
      if (format === 'rgb') {
        formattedString = this.toRgbString()
      }
      if (format === 'prgb') {
        formattedString = this.toPercentageRgbString()
      }
      if (format === 'hex' || format === 'hex6') {
        formattedString = this.toHexString()
      }
      if (format === 'hex3') {
        formattedString = this.toHexString(true)
      }
      if (format === 'hex4') {
        formattedString = this.toHex8String(true)
      }
      if (format === 'hex8') {
        formattedString = this.toHex8String()
      }
      if (format === 'name') {
        formattedString = this.toName()
      }
      if (format === 'hsl') {
        formattedString = this.toHslString()
      }
      if (format === 'hsv') {
        formattedString = this.toHsvString()
      }

      return formattedString || this.toHexString()
    },
    clone: function () {
      return tinycolor(this.toString())
    },

    _applyModification: function (fn, args) {
      const color = fn.apply(null, [this].concat([].slice.call(args)))
      this._r = color._r
      this._g = color._g
      this._b = color._b
      this.setAlpha(color._a)
      return this
    },
    lighten: function () {
      return this._applyModification(lighten, arguments)
    },
    brighten: function () {
      return this._applyModification(brighten, arguments)
    },
    darken: function () {
      return this._applyModification(darken, arguments)
    },
    desaturate: function () {
      return this._applyModification(desaturate, arguments)
    },
    saturate: function () {
      return this._applyModification(saturate, arguments)
    },
    greyscale: function () {
      return this._applyModification(greyscale, arguments)
    },
    spin: function () {
      return this._applyModification(spin, arguments)
    },

    _applyCombination: function (fn, args) {
      return fn.apply(null, [this].concat([].slice.call(args)))
    },
    analogous: function () {
      return this._applyCombination(analogous, arguments)
    },
    complement: function () {
      return this._applyCombination(complement, arguments)
    },
    monochromatic: function () {
      return this._applyCombination(monochromatic, arguments)
    },
    splitcomplement: function () {
      return this._applyCombination(splitcomplement, arguments)
    },
    triad: function () {
      return this._applyCombination(triad, arguments)
    },
    tetrad: function () {
      return this._applyCombination(tetrad, arguments)
    }
  }

  // If input is an object, force 1 into "1.0" to handle ratios properly
  // String input requires "1.0" as input, so 1 will be treated as 1
  tinycolor.fromRatio = function (color, opts) {
    if (typeof color === 'object') {
      const newColor = {}
      for (const i in color) {
        if (color.hasOwnProperty(i)) {
          if (i === 'a') {
            newColor[i] = color[i]
          } else {
            newColor[i] = convertToPercentage(color[i])
          }
        }
      }
      color = newColor
    }

    return tinycolor(color, opts)
  }

  // Given a string or object, convert that input to RGB
  // Possible string inputs:
  //
  //     "red"
  //     "#f00" or "f00"
  //     "#ff0000" or "ff0000"
  //     "#ff000000" or "ff000000"
  //     "rgb 255 0 0" or "rgb (255, 0, 0)"
  //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
  //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
  //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
  //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
  //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
  //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
  //
  function inputToRGB (color) {
    let rgb = { r: 0, g: 0, b: 0 }
    let a = 1
    let s = null
    let v = null
    let l = null
    let ok = false
    let format = false

    if (typeof color === 'string') {
      color = stringInputToObject(color)
    }

    if (typeof color === 'object') {
      if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
        rgb = rgbToRgb(color.r, color.g, color.b)
        ok = true
        format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb'
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
        s = convertToPercentage(color.s)
        v = convertToPercentage(color.v)
        rgb = hsvToRgb(color.h, s, v)
        ok = true
        format = 'hsv'
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
        s = convertToPercentage(color.s)
        l = convertToPercentage(color.l)
        rgb = hslToRgb(color.h, s, l)
        ok = true
        format = 'hsl'
      }

      if (color.hasOwnProperty('a')) {
        a = color.a
      }
    }

    a = boundAlpha(a)

    return {
      ok: ok,
      format: color.format || format,
      r: mathMin(255, mathMax(rgb.r, 0)),
      g: mathMin(255, mathMax(rgb.g, 0)),
      b: mathMin(255, mathMax(rgb.b, 0)),
      a: a
    }
  }

  // Conversion Functions
  // --------------------

  // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
  // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

  // `rgbToRgb`
  // Handle bounds / percentage checking to conform to CSS color spec
  // <http://www.w3.org/TR/css3-color/>
  // *Assumes:* r, g, b in [0, 255] or [0, 1]
  // *Returns:* { r, g, b } in [0, 255]
  function rgbToRgb (r, g, b) {
    return {
      r: bound01(r, 255) * 255,
      g: bound01(g, 255) * 255,
      b: bound01(b, 255) * 255
    }
  }

  // `rgbToHsl`
  // Converts an RGB color value to HSL.
  // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
  // *Returns:* { h, s, l } in [0,1]
  function rgbToHsl (r, g, b) {
    r = bound01(r, 255)
    g = bound01(g, 255)
    b = bound01(b, 255)

    const max = mathMax(r, g, b); const min = mathMin(r, g, b)
    let h; let s; const l = (max + min) / 2

    if (max == min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }

      h /= 6
    }

    return { h: h, s: s, l: l }
  }

  // `hslToRgb`
  // Converts an HSL color value to RGB.
  // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
  // *Returns:* { r, g, b } in the set [0, 255]
  function hslToRgb (h, s, l) {
    let r, g, b

    h = bound01(h, 360)
    s = bound01(s, 100)
    l = bound01(l, 100)

    function hue2rgb (p, q, t) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return { r: r * 255, g: g * 255, b: b * 255 }
  }

  // `rgbToHsv`
  // Converts an RGB color value to HSV
  // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
  // *Returns:* { h, s, v } in [0,1]
  function rgbToHsv (r, g, b) {
    r = bound01(r, 255)
    g = bound01(g, 255)
    b = bound01(b, 255)

    const max = mathMax(r, g, b); const min = mathMin(r, g, b)
    let h; let s; const v = max

    const d = max - min
    s = max === 0 ? 0 : d / max

    if (max == min) {
      h = 0 // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    return { h: h, s: s, v: v }
  }

  // `hsvToRgb`
  // Converts an HSV color value to RGB.
  // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
  // *Returns:* { r, g, b } in the set [0, 255]
  function hsvToRgb (h, s, v) {
    h = bound01(h, 360) * 6
    s = bound01(s, 100)
    v = bound01(v, 100)

    const i = Math.floor(h)
    const f = h - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)
    const mod = i % 6
    const r = [v, q, p, p, t, v][mod]
    const g = [t, v, v, q, p, p][mod]
    const b = [p, p, t, v, v, q][mod]

    return { r: r * 255, g: g * 255, b: b * 255 }
  }

  // `rgbToHex`
  // Converts an RGB color to hex
  // Assumes r, g, and b are contained in the set [0, 255]
  // Returns a 3 or 6 character hex
  function rgbToHex (r, g, b, allow3Char) {
    const hex = [
      pad2(mathRound(r).toString(16)),
      pad2(mathRound(g).toString(16)),
      pad2(mathRound(b).toString(16))
    ]

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0)
    }

    return hex.join('')
  }

  // `rgbaToHex`
  // Converts an RGBA color plus alpha transparency to hex
  // Assumes r, g, b are contained in the set [0, 255] and
  // a in [0, 1]. Returns a 4 or 8 character rgba hex
  function rgbaToHex (r, g, b, a, allow4Char) {
    const hex = [
      pad2(mathRound(r).toString(16)),
      pad2(mathRound(g).toString(16)),
      pad2(mathRound(b).toString(16)),
      pad2(convertDecimalToHex(a))
    ]

    // Return a 4 character hex if possible
    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0)
    }

    return hex.join('')
  }

  // `rgbaToArgbHex`
  // Converts an RGBA color to an ARGB Hex8 string
  // Rarely used, but required for "toFilter()"
  function rgbaToArgbHex (r, g, b, a) {
    const hex = [
      pad2(convertDecimalToHex(a)),
      pad2(mathRound(r).toString(16)),
      pad2(mathRound(g).toString(16)),
      pad2(mathRound(b).toString(16))
    ]

    return hex.join('')
  }

  // `equals`
  // Can be called with any tinycolor input
  tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) { return false }
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString()
  }

  tinycolor.random = function () {
    return tinycolor.fromRatio({
      r: mathRandom(),
      g: mathRandom(),
      b: mathRandom()
    })
  }

  // Modification Functions
  // ----------------------
  // Thanks to less.js for some of the basics here
  // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

  function desaturate (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10)
    const hsl = tinycolor(color).toHsl()
    hsl.s -= amount / 100
    hsl.s = clamp01(hsl.s)
    return tinycolor(hsl)
  }

  function saturate (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10)
    const hsl = tinycolor(color).toHsl()
    hsl.s += amount / 100
    hsl.s = clamp01(hsl.s)
    return tinycolor(hsl)
  }

  function greyscale (color) {
    return tinycolor(color).desaturate(100)
  }

  function lighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10)
    const hsl = tinycolor(color).toHsl()
    hsl.l += amount / 100
    hsl.l = clamp01(hsl.l)
    return tinycolor(hsl)
  }

  function brighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10)
    const rgb = tinycolor(color).toRgb()
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100))))
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100))))
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100))))
    return tinycolor(rgb)
  }

  function darken (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10)
    const hsl = tinycolor(color).toHsl()
    hsl.l -= amount / 100
    hsl.l = clamp01(hsl.l)
    return tinycolor(hsl)
  }

  // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
  // Values outside of this range will be wrapped into this range.
  function spin (color, amount) {
    const hsl = tinycolor(color).toHsl()
    const hue = (hsl.h + amount) % 360
    hsl.h = hue < 0 ? 360 + hue : hue
    return tinycolor(hsl)
  }

  // Combination Functions
  // ---------------------
  // Thanks to jQuery xColor for some of the ideas behind these
  // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

  function complement (color) {
    const hsl = tinycolor(color).toHsl()
    hsl.h = (hsl.h + 180) % 360
    return tinycolor(hsl)
  }

  function triad (color) {
    const hsl = tinycolor(color).toHsl()
    const h = hsl.h
    return [
      tinycolor(color),
      tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
      tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ]
  }

  function tetrad (color) {
    const hsl = tinycolor(color).toHsl()
    const h = hsl.h
    return [
      tinycolor(color),
      tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
      tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
      tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ]
  }

  function splitcomplement (color) {
    const hsl = tinycolor(color).toHsl()
    const h = hsl.h
    return [
      tinycolor(color),
      tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
      tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l })
    ]
  }

  function analogous (color, results, slices) {
    results = results || 6
    slices = slices || 30

    const hsl = tinycolor(color).toHsl()
    const part = 360 / slices
    const ret = [tinycolor(color)]

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results;) {
      hsl.h = (hsl.h + part) % 360
      ret.push(tinycolor(hsl))
    }
    return ret
  }

  function monochromatic (color, results) {
    results = results || 6
    const hsv = tinycolor(color).toHsv()
    const h = hsv.h; const s = hsv.s; let v = hsv.v
    const ret = []
    const modification = 1 / results

    while (results--) {
      ret.push(tinycolor({ h: h, s: s, v: v }))
      v = (v + modification) % 1
    }

    return ret
  }

  // Utility Functions
  // ---------------------

  tinycolor.mix = function (color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50)

    const rgb1 = tinycolor(color1).toRgb()
    const rgb2 = tinycolor(color2).toRgb()

    const p = amount / 100

    const rgba = {
      r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
      g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
      b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
      a: ((rgb2.a - rgb1.a) * p) + rgb1.a
    }

    return tinycolor(rgba)
  }

  // Readability Functions
  // ---------------------
  // <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

  // `contrast`
  // Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
  tinycolor.readability = function (color1, color2) {
    const c1 = tinycolor(color1)
    const c2 = tinycolor(color2)
    return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05)
  }

  // `isReadable`
  // Ensure that foreground and background color combinations meet WCAG2 guidelines.
  // The third argument is an optional Object.
  //      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
  //      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
  // If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

  // *Example*
  //    tinycolor.isReadable("#000", "#111") => false
  //    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
  tinycolor.isReadable = function (color1, color2, wcag2) {
    const readability = tinycolor.readability(color1, color2)
    let wcag2Parms, out

    out = false

    wcag2Parms = validateWCAG2Parms(wcag2)
    switch (wcag2Parms.level + wcag2Parms.size) {
      case 'AAsmall':
      case 'AAAlarge':
        out = readability >= 4.5
        break
      case 'AAlarge':
        out = readability >= 3
        break
      case 'AAAsmall':
        out = readability >= 7
        break
    }
    return out
  }

  // `mostReadable`
  // Given a base color and a list of possible foreground or background
  // colors for that base, returns the most readable color.
  // Optionally returns Black or White if the most readable color is unreadable.
  // *Example*
  //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
  //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
  //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
  //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
  tinycolor.mostReadable = function (baseColor, colorList, args) {
    let bestColor = null
    let bestScore = 0
    let readability
    let includeFallbackColors, level, size
    args = args || {}
    includeFallbackColors = args.includeFallbackColors
    level = args.level
    size = args.size

    for (let i = 0; i < colorList.length; i++) {
      readability = tinycolor.readability(baseColor, colorList[i])
      if (readability > bestScore) {
        bestScore = readability
        bestColor = tinycolor(colorList[i])
      }
    }

    if (tinycolor.isReadable(baseColor, bestColor, { level: level, size: size }) || !includeFallbackColors) {
      return bestColor
    } else {
      args.includeFallbackColors = false
      return tinycolor.mostReadable(baseColor, ['#fff', '#000'], args)
    }
  }

  // Big List of Colors
  // ------------------
  // <http://www.w3.org/TR/css3-color/#svg-color>
  const names = tinycolor.names = {
    aliceblue: 'f0f8ff',
    antiquewhite: 'faebd7',
    aqua: '0ff',
    aquamarine: '7fffd4',
    azure: 'f0ffff',
    beige: 'f5f5dc',
    bisque: 'ffe4c4',
    black: '000',
    blanchedalmond: 'ffebcd',
    blue: '00f',
    blueviolet: '8a2be2',
    brown: 'a52a2a',
    burlywood: 'deb887',
    burntsienna: 'ea7e5d',
    cadetblue: '5f9ea0',
    chartreuse: '7fff00',
    chocolate: 'd2691e',
    coral: 'ff7f50',
    cornflowerblue: '6495ed',
    cornsilk: 'fff8dc',
    crimson: 'dc143c',
    cyan: '0ff',
    darkblue: '00008b',
    darkcyan: '008b8b',
    darkgoldenrod: 'b8860b',
    darkgray: 'a9a9a9',
    darkgreen: '006400',
    darkgrey: 'a9a9a9',
    darkkhaki: 'bdb76b',
    darkmagenta: '8b008b',
    darkolivegreen: '556b2f',
    darkorange: 'ff8c00',
    darkorchid: '9932cc',
    darkred: '8b0000',
    darksalmon: 'e9967a',
    darkseagreen: '8fbc8f',
    darkslateblue: '483d8b',
    darkslategray: '2f4f4f',
    darkslategrey: '2f4f4f',
    darkturquoise: '00ced1',
    darkviolet: '9400d3',
    deeppink: 'ff1493',
    deepskyblue: '00bfff',
    dimgray: '696969',
    dimgrey: '696969',
    dodgerblue: '1e90ff',
    firebrick: 'b22222',
    floralwhite: 'fffaf0',
    forestgreen: '228b22',
    fuchsia: 'f0f',
    gainsboro: 'dcdcdc',
    ghostwhite: 'f8f8ff',
    gold: 'ffd700',
    goldenrod: 'daa520',
    gray: '808080',
    green: '008000',
    greenyellow: 'adff2f',
    grey: '808080',
    honeydew: 'f0fff0',
    hotpink: 'ff69b4',
    indianred: 'cd5c5c',
    indigo: '4b0082',
    ivory: 'fffff0',
    khaki: 'f0e68c',
    lavender: 'e6e6fa',
    lavenderblush: 'fff0f5',
    lawngreen: '7cfc00',
    lemonchiffon: 'fffacd',
    lightblue: 'add8e6',
    lightcoral: 'f08080',
    lightcyan: 'e0ffff',
    lightgoldenrodyellow: 'fafad2',
    lightgray: 'd3d3d3',
    lightgreen: '90ee90',
    lightgrey: 'd3d3d3',
    lightpink: 'ffb6c1',
    lightsalmon: 'ffa07a',
    lightseagreen: '20b2aa',
    lightskyblue: '87cefa',
    lightslategray: '789',
    lightslategrey: '789',
    lightsteelblue: 'b0c4de',
    lightyellow: 'ffffe0',
    lime: '0f0',
    limegreen: '32cd32',
    linen: 'faf0e6',
    magenta: 'f0f',
    maroon: '800000',
    mediumaquamarine: '66cdaa',
    mediumblue: '0000cd',
    mediumorchid: 'ba55d3',
    mediumpurple: '9370db',
    mediumseagreen: '3cb371',
    mediumslateblue: '7b68ee',
    mediumspringgreen: '00fa9a',
    mediumturquoise: '48d1cc',
    mediumvioletred: 'c71585',
    midnightblue: '191970',
    mintcream: 'f5fffa',
    mistyrose: 'ffe4e1',
    moccasin: 'ffe4b5',
    navajowhite: 'ffdead',
    navy: '000080',
    oldlace: 'fdf5e6',
    olive: '808000',
    olivedrab: '6b8e23',
    orange: 'ffa500',
    orangered: 'ff4500',
    orchid: 'da70d6',
    palegoldenrod: 'eee8aa',
    palegreen: '98fb98',
    paleturquoise: 'afeeee',
    palevioletred: 'db7093',
    papayawhip: 'ffefd5',
    peachpuff: 'ffdab9',
    peru: 'cd853f',
    pink: 'ffc0cb',
    plum: 'dda0dd',
    powderblue: 'b0e0e6',
    purple: '800080',
    rebeccapurple: '663399',
    red: 'f00',
    rosybrown: 'bc8f8f',
    royalblue: '4169e1',
    saddlebrown: '8b4513',
    salmon: 'fa8072',
    sandybrown: 'f4a460',
    seagreen: '2e8b57',
    seashell: 'fff5ee',
    sienna: 'a0522d',
    silver: 'c0c0c0',
    skyblue: '87ceeb',
    slateblue: '6a5acd',
    slategray: '708090',
    slategrey: '708090',
    snow: 'fffafa',
    springgreen: '00ff7f',
    steelblue: '4682b4',
    tan: 'd2b48c',
    teal: '008080',
    thistle: 'd8bfd8',
    tomato: 'ff6347',
    turquoise: '40e0d0',
    violet: 'ee82ee',
    wheat: 'f5deb3',
    white: 'fff',
    whitesmoke: 'f5f5f5',
    yellow: 'ff0',
    yellowgreen: '9acd32'
  }

  // Make it easy to access colors via `hexNames[hex]`
  var hexNames = tinycolor.hexNames = flip(names)

  // Utilities
  // ---------

  // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
  function flip (o) {
    const flipped = { }
    for (const i in o) {
      if (o.hasOwnProperty(i)) {
        flipped[o[i]] = i
      }
    }
    return flipped
  }

  // Return a valid alpha value [0,1] with all invalid values being set to 1
  function boundAlpha (a) {
    a = parseFloat(a)

    if (isNaN(a) || a < 0 || a > 1) {
      a = 1
    }

    return a
  }

  // Take input from [0, n] and return it as [0, 1]
  function bound01 (n, max) {
    if (isOnePointZero(n)) { n = '100%' }

    const processPercent = isPercentage(n)
    n = mathMin(max, mathMax(0, parseFloat(n)))

    // Automatically convert percentage into number
    if (processPercent) {
      n = parseInt(n * max, 10) / 100
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
      return 1
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max)
  }

  // Force a number between 0 and 1
  function clamp01 (val) {
    return mathMin(1, mathMax(0, val))
  }

  // Parse a base-16 hex value into a base-10 integer
  function parseIntFromHex (val) {
    return parseInt(val, 16)
  }

  // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
  // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
  function isOnePointZero (n) {
    return typeof n === 'string' && n.indexOf('.') != -1 && parseFloat(n) === 1
  }

  // Check to see if string passed in is a percentage
  function isPercentage (n) {
    return typeof n === 'string' && n.indexOf('%') != -1
  }

  // Force a hex value to have 2 characters
  function pad2 (c) {
    return c.length == 1 ? '0' + c : '' + c
  }

  // Replace a decimal with it's percentage value
  function convertToPercentage (n) {
    if (n <= 1) {
      n = (n * 100) + '%'
    }

    return n
  }

  // Converts a decimal to a hex value
  function convertDecimalToHex (d) {
    return Math.round(parseFloat(d) * 255).toString(16)
  }
  // Converts a hex value to a decimal
  function convertHexToDecimal (h) {
    return (parseIntFromHex(h) / 255)
  }

  const matchers = (function () {
    // <http://www.w3.org/TR/css3-values/#integers>
    const CSS_INTEGER = '[-\\+]?\\d+%?'

    // <http://www.w3.org/TR/css3-values/#number-value>
    const CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?'

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    const CSS_UNIT = '(?:' + CSS_NUMBER + ')|(?:' + CSS_INTEGER + ')'

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    const PERMISSIVE_MATCH3 = '[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?'
    const PERMISSIVE_MATCH4 = '[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?'

    return {
      CSS_UNIT: new RegExp(CSS_UNIT),
      rgb: new RegExp('rgb' + PERMISSIVE_MATCH3),
      rgba: new RegExp('rgba' + PERMISSIVE_MATCH4),
      hsl: new RegExp('hsl' + PERMISSIVE_MATCH3),
      hsla: new RegExp('hsla' + PERMISSIVE_MATCH4),
      hsv: new RegExp('hsv' + PERMISSIVE_MATCH3),
      hsva: new RegExp('hsva' + PERMISSIVE_MATCH4),
      hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
      hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
      hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
      hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    }
  })()

  // `isValidCSSUnit`
  // Take in a single string / number and check to see if it looks like a CSS unit
  // (see `matchers` above for definition).
  function isValidCSSUnit (color) {
    return !!matchers.CSS_UNIT.exec(color)
  }

  // `stringInputToObject`
  // Permissive string parsing.  Take in a number of formats, and output an object
  // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
  function stringInputToObject (color) {
    color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase()
    let named = false
    if (names[color]) {
      color = names[color]
      named = true
    } else if (color == 'transparent') {
      return { r: 0, g: 0, b: 0, a: 0, format: 'name' }
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    let match
    if ((match = matchers.rgb.exec(color))) {
      return { r: match[1], g: match[2], b: match[3] }
    }
    if ((match = matchers.rgba.exec(color))) {
      return { r: match[1], g: match[2], b: match[3], a: match[4] }
    }
    if ((match = matchers.hsl.exec(color))) {
      return { h: match[1], s: match[2], l: match[3] }
    }
    if ((match = matchers.hsla.exec(color))) {
      return { h: match[1], s: match[2], l: match[3], a: match[4] }
    }
    if ((match = matchers.hsv.exec(color))) {
      return { h: match[1], s: match[2], v: match[3] }
    }
    if ((match = matchers.hsva.exec(color))) {
      return { h: match[1], s: match[2], v: match[3], a: match[4] }
    }
    if ((match = matchers.hex8.exec(color))) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        a: convertHexToDecimal(match[4]),
        format: named ? 'name' : 'hex8'
      }
    }
    if ((match = matchers.hex6.exec(color))) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        format: named ? 'name' : 'hex'
      }
    }
    if ((match = matchers.hex4.exec(color))) {
      return {
        r: parseIntFromHex(match[1] + '' + match[1]),
        g: parseIntFromHex(match[2] + '' + match[2]),
        b: parseIntFromHex(match[3] + '' + match[3]),
        a: convertHexToDecimal(match[4] + '' + match[4]),
        format: named ? 'name' : 'hex8'
      }
    }
    if ((match = matchers.hex3.exec(color))) {
      return {
        r: parseIntFromHex(match[1] + '' + match[1]),
        g: parseIntFromHex(match[2] + '' + match[2]),
        b: parseIntFromHex(match[3] + '' + match[3]),
        format: named ? 'name' : 'hex'
      }
    }

    return false
  }

  function validateWCAG2Parms (parms) {
    // return valid WCAG2 parms for isReadable.
    // If input parms are invalid, return {"level":"AA", "size":"small"}
    let level, size
    parms = parms || { level: 'AA', size: 'small' }
    level = (parms.level || 'AA').toUpperCase()
    size = (parms.size || 'small').toLowerCase()
    if (level !== 'AA' && level !== 'AAA') {
      level = 'AA'
    }
    if (size !== 'small' && size !== 'large') {
      size = 'small'
    }
    return { level: level, size: size }
  }

  // Node: Export function
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = tinycolor
  }
  // AMD/requirejs: Define the module
  else if (typeof define === 'function' && define.amd) {
    define(function () { return tinycolor })
  }
  // Browser: Expose to window
  else {
    window.tinycolor = tinycolor
  }
})(Math)
