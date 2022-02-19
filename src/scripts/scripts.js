import { LoadParticles } from './lib-loader.js';

(function () {
  /**
   * here we check for elements that have dashes in their tagname
   * which tells us that they are not a standard html element
   * but a custom element
   * so we load their script fron the scripts folder
   * and we instantiate them
   */
  window.addEventListener('load', function () {
    const elements = document.querySelector('body').querySelectorAll('*')
    const cutomElements = Array.from(elements).filter(element => element.tagName.indexOf('-') > -1)
    let customElementTags = cutomElements.map(element => element.tagName.toLowerCase())
    customElementTags = customElementTags.filter((value, index, self) => {
      return self.indexOf(value) === index
    })
    LoadParticles(customElementTags)
  })
})()
