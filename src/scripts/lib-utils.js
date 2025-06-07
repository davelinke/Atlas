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

export const arrayMove = (arr, old_index, new_index) => {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
  return arr // for testing
}
