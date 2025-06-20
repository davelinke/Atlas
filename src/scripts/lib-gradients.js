/**
 * Utility combine multiple regular expressions.
 *
 * @param {RegExp[]|string[]} regexpList List of regular expressions or strings.
 * @param {string} flags Normal RegExp flags.
 */
const combineRegExp = function (regexpList, flags) {
  let i
  let source = ''
  for (i = 0; i < regexpList.length; i++) {
    if (typeof regexpList[i] === 'string') {
      source += regexpList[i]
    } else {
      source += regexpList[i].source
    }
  }
  return new RegExp(source, flags)
}

/**
 * Generate the required regular expressions once.
 *
 * Regular Expressions are easier to manage this way and can be well described.
 *
 * @result {object} Object containing regular expressions.
 */
const generateRegExp = function () {
  // Note any variables with "Capture" in name include capturing bracket set(s).
  const searchFlags = 'gi' // ignore case for angles, "rgb" etc
  const rAngle = /(?:[+-]?\d*\.?\d+)(?:deg|grad|rad|turn)/ // Angle +ive, -ive and angle types
  const rSideCornerCapture = /to\s+((?:(?:left|right)(?:\s+(?:top|bottom))?))/ // optional 2nd part
  const rComma = /\s*,\s*/ // Allow space around comma.
  const rColorHex = /\#(?:[a-f0-9]{6}|[a-f0-9]{3})/ // 3 or 6 character form
  const rDigits3 = /\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}\s*\)/; const // "(1, 2, 3)"
    rDigits4 = /\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}\s*,\s*\d*\.?\d+\)/; const // "(1, 2, 3, 4)"
    rValue = /(?:[+-]?\d*\.?\d+)(?:%|[a-z]+)?/; const // ".9", "-5px", "100%".
    rKeyword = /[_a-z-][_a-z0-9-]*/; const // "red", "transparent", "border-collapse".
    rColor = combineRegExp([
      '(?:', rColorHex, '|', '(?:rgb|hsl)', rDigits3, '|', '(?:rgba|hsla)', rDigits4, '|', rKeyword, ')'
    ], '')
  const rColorStop = combineRegExp([rColor, '(?:\\s+', rValue, '(?:\\s+', rValue, ')?)?'], ''); const // Single Color Stop, optional %, optional length.
    rColorStopList = combineRegExp(['(?:', rColorStop, rComma, ')*', rColorStop], ''); const // List of color stops min 1.
    rLineCapture = combineRegExp(['(?:(', rAngle, ')|', rSideCornerCapture, ')'], ''); const // Angle or SideCorner
    rGradientSearch = combineRegExp([
      '(?:(', rLineCapture, ')', rComma, ')?(', rColorStopList, ')'
    ], searchFlags); const // Capture 1:"line", 2:"angle" (optional), 3:"side corner" (optional) and 4:"stop list".
    rColorStopSearch = combineRegExp([
      '\\s*(', rColor, ')', '(?:\\s+', '(', rValue, '))?', '(?:', rComma, '\\s*)?'
    ], searchFlags)// Capture 1:"color" and 2:"position" (optional).

  return {
    gradientSearch: rGradientSearch,
    colorStopSearch: rColorStopSearch
  }
}

/**
 * Actually parse the input gradient parameters string into an object for reusability.
 *
 *
 * @note Really this only supports the standard syntax not historical versions, see MDN for details
 *       https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient
 *
 * @param regExpLib
 * @param {string} input Input string in the form "to right bottom, #FF0 0%, red 20px, rgb(0, 0, 255) 100%"
 * @returns {object|undefined} Object containing break down of input string including array of stop points.
 */
const pg = function (regExpLib, input) {
  let result,
    matchGradient,
    matchColorStop,
    stopResult

  // reset search position, because we reuse regex.
  regExpLib.gradientSearch.lastIndex = 0

  matchGradient = regExpLib.gradientSearch.exec(input)
  if (matchGradient !== null) {
    result = {
      original: matchGradient[0],
      colorStopList: []
    }

    // Line (Angle or Side-Corner).
    if (matchGradient[1]) {
      result.line = matchGradient[1]
    }
    // Angle or undefined if side-corner.
    if (matchGradient[2]) {
      result.angle = matchGradient[2]
    }
    // Side-corner or undefined if angle.
    if (matchGradient[3]) {
      result.sideCorner = matchGradient[3]
    }

    // reset search position, because we reuse regex.
    regExpLib.colorStopSearch.lastIndex = 0

    // Loop though all the color-stops.
    matchColorStop = regExpLib.colorStopSearch.exec(matchGradient[4])
    while (matchColorStop !== null) {
      stopResult = {
        color: matchColorStop[1]
      }

      // Position (optional).
      if (matchColorStop[2]) {
        const posArray = matchColorStop[2].match(/(\d+)|\D+$/g)
        stopResult.position = parseInt(posArray[0])
        stopResult.unit = posArray[1]
      }
      result.colorStopList.push(stopResult)

      // Continue searching from previous position.
      matchColorStop = regExpLib.colorStopSearch.exec(matchGradient[4])
    }
  }

  // Can be undefined if match not found.
  return result
}

const test_this_one = function (regExpLib, input) {
  let result
  const rGradientEnclosedInBrackets = /.*gradient\s*\(((?:\([^\)]*\)|[^\)\(]*)*)\)/; const // Captures inside brackets - max one additional inner set.
    match = rGradientEnclosedInBrackets.exec(input)

  if (match !== null) {
    // Get the parameters for the gradient
    result = pg(regExpLib, match[1])
    if (result.original.trim() !== match[1].trim()) {
      // Did not match the input exactly - possible parsing error.
      result.parseWarning = true
    }
  } else {
    result = 'Failed to find gradient'
  }

  return result
}

const test_this_thing = function () {
  const result = []
  const regExpLib = generateRegExp()
  const testSubjects = [
    // Original question sample
    'background-image:linear-gradient(to right bottom, #FF0000 0%, #00FF00 20px, rgb(0, 0, 255) 100%);',
    // Sample to test RGBA values (1)
    'background-image:linear-gradient(to right bottom, rgba(255, 0, 0, .1) 0%, rgba(0, 255, 0, 0.9) 20px);',
    // Sample to test optional gradient line
    'background-image:linear-gradient(#FF0000 0%, #00FF00 20px, rgb(0, 0, 255) 100%);',
    // Angle, named colors
    'background: linear-gradient(45deg, red, blue);',
    // Gradient that starts at 60% of the gradient line
    'background: linear-gradient(135deg, orange, orange 60%, cyan);',
    // Gradient with multi-position color stops
    'background: linear-gradient(to right, red 20%, orange 20% 40%, yellow 40% 60%, green 60% 80%, blue 80%);'
  ]
  for (let i = 0; i < testSubjects.length; i++) {
    result.push(test_this_one(regExpLib, testSubjects[i]))
  }
}

export const parseGradient = (gradient) => {
  let gr = gradient
  const regExpLib = generateRegExp()
  let go = {}
  go.repeat = new RegExp(/repeat/).test(gradient)
  if (go.repeat) {
    gr.replace('repeat-', '')
  }
  const isConic = new RegExp(/conic-gradient/).test(gr)
  if (isConic) {
    go.type = 'conic'
    const hasAngle = new RegExp(/from/).test(gr)
    const hasPositioning = new RegExp(/at\s*/).test(gr)
    if (!hasPositioning) {
      go.position = {
        x: {
          unit: '%',
          value: 50
        },
        y: {
          unit: '%',
          value: 50
        }
      }
    }

    if (!hasAngle) {
      go.angle = '0deg'
    }

    if (hasAngle || hasPositioning) {
      const grMeat = gr.split('(')
      const grPieces = grMeat[1].split(',')

      if (hasPositioning) {
        go.position = {}
        const positionArray = grPieces[0].trim().split('at ')[1].split(' ')
        if (positionArray.length === 1) {
          positionArray.push('50%')
        }
        positionArray.forEach((p, i) => {
          const posObj = i === 0 ? 'x' : 'y'
          go.position[posObj] = {}
          go.position[posObj].unit = p.match(/px/) ? 'px' : '%'
          go.position[posObj].value = parseFloat(p.replace(/px|%/g, ''))
        })
      }

      if (hasAngle) {
        go.angle = grPieces[0].trim().split(' ')[1]
      }

      grPieces.shift()
      grMeat[1] = grPieces.join(',')
      gr = grMeat.join('(')
    }
  } else if (new RegExp(/radial-gradient/).test(gr)) {
    go.type = 'radial'
    go.shape = new RegExp(/circle/).test(gr) ? 'circle' : null
    if (!go.shape) {
      go.shape = new RegExp(/ellipse/).test(gr) ? 'ellipse' : null
    }
    const hasPositioning = new RegExp(/at\s*/).test(gr)

    if (!hasPositioning) {
      go.position = {
        x: {
          unit: '%',
          value: 50
        },
        y: {
          unit: '%',
          value: 50
        }
      }
    }

    if (go.shape || hasPositioning) {
      const grMeat = gr.split('(')
      const grPieces = grMeat[1].split(',')

      if (hasPositioning) {
        go.position = {}
        const positionArray = grPieces[0].trim().split('at ')[1].split(' ')
        if (positionArray.length === 1) {
          positionArray.push('50%')
        }
        positionArray.forEach((p, i) => {
          const posObj = i === 0 ? 'x' : 'y'
          go.position[posObj] = {}
          go.position[posObj].unit = p.match(/px/) ? 'px' : '%'
          go.position[posObj].value = parseFloat(p.replace(/px|%/g, ''))
        })
      }

      grPieces.shift()
      grMeat[1] = grPieces.join(',')
      gr = grMeat.join('(')
    }

    if (!go.shape) {
      go.shape = 'ellipse'
    }
  } else {
    go.type = 'linear'
  }

  go = { ...go, ...test_this_one(regExpLib, gr) }

  return go
}
// test_this_thing();
