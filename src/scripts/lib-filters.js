export const coordsFilterFn = (
  coords,
  gridActive = false,
  gridSize,
  zoomScale,
  isEdit = true) => {
  // snap to grid
  const roundToMultiple = (num, multiple) => {
    return Math.round(num / multiple) * multiple
  }

  const nCoords = { ...{ left: 0, top: 0, width: 0, height: 0 }, ...coords }

  let nleft = nCoords.left
  let ntop = nCoords.top
  let nright = nCoords.right
  let nbottom = nCoords.bottom

  if (gridActive) {
    nleft = roundToMultiple(nleft, (gridSize * zoomScale))
    ntop = roundToMultiple(ntop, (gridSize * zoomScale))
    nright = roundToMultiple(nright, (gridSize * zoomScale))
    nbottom = roundToMultiple(nbottom, (gridSize * zoomScale))
  }

  const cx = 0
  const cy = 0

  // if (!isEdit) {
  //   // calculate offset of the grid
  //   const a = ((this.viewportDim * this.zoomScale) / 2)
  //   const b = Math.round(((this.viewportDim * this.zoomScale) / 2) / (this.gridSize * this.zoomScale)) * (this.gridSize * this.zoomScale);
  //   cx = a - b;
  //   cy = a - b;
  // }

  return {
    left: nleft + cx,
    top: ntop + cy,
    right: nright + cx,
    bottom: nbottom + cy
  }
}

export const filterCoord = (num, multiple) => {
  return Math.round(num / multiple) * multiple
}
