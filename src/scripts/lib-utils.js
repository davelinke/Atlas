export const pxWidthToNumber = (pxWidth) => {
  return parseInt(pxWidth.replace('px', ''), 10)
}
export const createNumInput = (name) => {
  return createInput('number', name)
}

export const createInput = (type, name) => {
  const input = document.createElement('input')
  input.type = type
  input.name = name
  return input
}
