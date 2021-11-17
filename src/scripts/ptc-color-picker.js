const Css = `
:host{
    display: inline-flex;
}
.swatch-wrapper{
    background-image:
        linear-gradient(45deg, #aaaaaa 25%, transparent 25%),
        linear-gradient(-45deg, #aaaaaa 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #aaaaaa 75%),
        linear-gradient(-45deg, transparent 75%, #aaaaaa 75%);
    background-size:16px 16px;
    background-position:0 0,0 8px,8px -8px,8px 0px;
    display: inline-block;
    width: 48px;
    border-radius:3px;
    height:24px;
    overflow:hidden;
    box-sizing:border-box;
    border:1px solid #ccc;
}
.swatch{
    position:relative;
    width:100%;
    height:100%;
}

.color-input{
    display:block;
    width:100%;
    height:100%;
    border:0;
    border-radius:3px;
    opacity:0;
    position:absolute;
    top:0;
    left:0;
}

.initial{
    display: inline-flex;
    width: 1.5rem;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}
`
export default class PtcColorPicker extends HTMLElement {

    constructor() {
        super();

        this._value = null;

        this._color = 'transparent'

        this._opacity = 100;

        this._name = null;

        this._initial = null;

        Object.defineProperty(this, 'initial', {
            get: () => {
                return this._initial;
            },
            set: (val) => {
                if (val) {
                    this._initial = val;
                    this.setAttribute('initial', val);
                } else {
                    this.removeAttribute('initial');
                }
            }
        })

        Object.defineProperty(this, 'name', {
            get: () => {
                return this._name;
            },
            set: (val) => {
                if (val) {
                    this._name = val;
                    this.setAttribute('name', val);
                } else {
                    this.removeAttribute('name');
                }
            }
        })


        Object.defineProperty(this, 'value', {
            get: () => {
                return this._value;
            },
            set: (val) => {
                if (val) {
                    this._value = val;
                    this.setAttribute('value', val);
                    this.swatch.style.backgroundColor = val;
                    
                    // split between solid color and opacity
                    const color = tinycolor(val);
                    this._opacity = color.getAlpha();
                    this.opacityInput.value = this._opacity;

                    const solidColor = color.setAlpha(1).toHexString();
                    this.colorInput.value = solidColor;

                    this._color = solidColor;
                } else {
                    this.removeAttribute('value');
                    this.swatch.style.backgroundColor = 'transparent';
                }
            }
        })

        this.setColor = ()=>{
            const TinyColor = window.tinycolor;
            const color = TinyColor(this._color);
            color.setAlpha(this._opacity);

            this.value = color.toRgbString();
            this.swatch.style.backgroundColor = this.value;

            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    value: this.value
                },
                bubbles: true,
                composed: true
            }));
        }

        this.onColorChange = (e) => {
            this._color = e.target.value;
            this.setColor();
        }
        this.onOpacityChange = (e) => {
            this._opacity = e.target.value;
            this.setColor();
        }
        


        // attach shadow dom
        this._shadow = this.attachShadow({ mode: 'open' })

        const styles = document.createElement('style')
        styles.innerHTML = Css
        this._shadow.appendChild(styles)

        this.initial = this.getAttribute('initial');
        if (this.initial) {
            const initial = document.createElement('div')
            initial.classList.add('initial')
            initial.innerHTML = this.initial
            this._shadow.appendChild(initial)
        }

        const swatchWrapper = document.createElement('div')
        swatchWrapper.classList.add('swatch-wrapper');

        this.swatch = document.createElement('div')
        this.swatch.classList.add('swatch')

        this._color = this.getAttribute('value')
        this.swatch.style.backgroundColor = this._color;

        this._name = this.getAttribute('name')

        this.colorInput = document.createElement('input')
        this.colorInput.classList.add('color-input')
        this.colorInput.type = 'color'
        this.colorInput.value = this._color
        this.colorInput.addEventListener('input', this.onColorChange)

        this.swatch.appendChild(this.colorInput)

        swatchWrapper.appendChild(this.swatch)
        
        this._shadow.appendChild(swatchWrapper);

        this.opacityInput = document.createElement('input')
        this.opacityInput.type = 'range'
        this.opacityInput.min = 0
        this.opacityInput.max = 1
        this.opacityInput.step = 0.01
        this.opacityInput.value = this._opacity
        this.opacityInput.addEventListener('input', this.onOpacityChange)

        this._shadow.appendChild(this.opacityInput)
    }
    connectedCallback() {
    }

    // static get observedAttributes () { return ['value'] }

    // attributeChangedCallback (name, oldValue, newValue) {
    //   if (this._attrChangeMethods[name]) {
    //     this._attrChangeMethods[name](newValue, oldValue)
    //   }
    // }
}