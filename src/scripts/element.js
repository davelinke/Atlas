class CustomElement extends HTMLElement {
  constructor () {
    super()

    this._lang = {}

    this.echo = (key) => {
      const term = this._lang[key]
      return term || key
    }
  }

  async connectedCallback () {
    const lang = document.documentElement.lang
    const langPath = `./languages/${lang}.js`
    const langModule = await import(langPath)

    this._lang = langModule.default
  }
}

export default CustomElement
