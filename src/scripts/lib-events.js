export const fireEvent = (element, eventName, detail) => {
  const event = new CustomEvent(eventName, {
    bubbles: true,
    composed: true,
    detail
  })
  element.dispatchEvent(event)
}

export const listenTo = (element, eventName, callback) => {
  element.addEventListener(eventName, callback)
}
