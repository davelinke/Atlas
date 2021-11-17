import * as ColorPicker from './lib-color-picker.js'
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
    display: block;
    width: 32px;
    border-radius:3px;
    height:24px;
    overflow:hidden;
    box-sizing:border-box;
    border:1px solid #ccc;
    flex: 0 0 auto;
}
.swatch{
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
.color-overlay{
    position:absolute;
    opacity:0;
    pointer-events:none;

    z-index: 1;
    padding: 12px;
    background-color: #fff;
    box-shadow: 0 2px 3px rgb(0 0 0 / 25%);
    border-radius: 4px;
    right:17px;

    margin-block-start:26px;
}
.color-overlay.visible{
    opacity:1;
    pointer-events:auto;
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
                    this.colorInput.value = val;

                    this._color = val;
                } else {
                    this.removeAttribute('value');
                    this.swatch.style.backgroundColor = 'transparent';
                }
            }
        })

        this.setColor = () => {
            this.value = this._color
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

        this.closeOverlay = (e)=>{
            const path = e.path || (e.composedPath && e.composedPath());
            if ((this.getAttribute('open') === 'true') && !path.includes(this.colorOverlay)) {
                this.colorOverlay.classList.remove('visible')
                this.removeAttribute('open');
                document.removeEventListener('mousedown', this.closeOverlay);
                document.removeEventListener('workspaceInputStart', this.closeOverlay);
            }
        }

        this.swatch = document.createElement('div')
        this.swatch.classList.add('swatch')
        this.swatch.addEventListener('mousedown', (e) => {
            this.colorOverlay.classList.add('visible')
            this.setAttribute('open','true');
            setTimeout(()=>{
                document.addEventListener('mousedown', this.closeOverlay)
                document.addEventListener('workspaceInputStart', this.closeOverlay)
            },0)
            
        })

        this._color = this.getAttribute('value')
        this.swatch.style.backgroundColor = this._color;

        this._name = this.getAttribute('name')

        swatchWrapper.appendChild(this.swatch)

        this._shadow.appendChild(swatchWrapper);

        this.colorOverlay = document.createElement('div');
        this.colorOverlay.classList.add('color-overlay');


        this.colorInput = document.createElement('color-picker')
        this.colorInput.formats = ['hex', 'rgb', 'hsl']
        this.colorInput.addEventListener('input', this.onColorChange)

        this.colorOverlay.appendChild(this.colorInput)
        this._shadow.appendChild(this.colorOverlay)

    }
}