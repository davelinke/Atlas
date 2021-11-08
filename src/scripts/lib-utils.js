export const pxWidthToNumber = (pxWidth) => {
  return parseInt(pxWidth.replace('px', ''), 10)
}

export const createInput = (args) => {
  const input = document.createElement('input')
  for (const key in args) {
    input[key] = args[key]
  }
  return input
}
