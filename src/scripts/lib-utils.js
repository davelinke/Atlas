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

export const arrayMove = (arr, oldIndex, newIndex) => {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
  return arr // for testing
}
