import { LoadParticles } from "./lib-loader.js";
import { fireEvent } from './lib-events.js'

const Css = `
.instance-container{
    display: inline-grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-row-gap:0.75rem;
    font-size: 12px;
    margin-block-start: 1.25rem;
}
.instance-container:first-child{
    margin-block-start: 0;
}
input[type=number] {
    width: 25px;
    border: none;
    background-color: #efefef;
    border-radius: 3px;
    font-family: inherit;
    font-size: 12px;
    padding: 0.25rem;
}
input[type="number"] {
    -webkit-appearance: textfield;
       -moz-appearance: textfield;
            appearance: textfield;
  }
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
  }
label{
    display: inline-block;
    margin-inline: 4px;
}
ptc-color-picker{
    flex:1 1 auto;
}
.iodiv{
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    grid-column: span 4;
    align-items: center;
    padding-inline-start: 11px;
}
.iodiv > div {
    display:flex;
    align-items: center;
}
.flex{
    display: flex;
    align-items: center;
}
.span-2{
  grid-column: span 4;
}
.shadow-header{
    grid-column: span 4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fbfbfb;
    padding: 4px 4px 4px 6px;
    border-radius: 4px;
}
.shadow-header h4{
    margin:0;
    font-weight: normal;
    text-transform: uppercase;
}
.shadow-header button{
    border: none;
    background: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    color: #333;
}
`
export default class PtcShadowPicker extends HTMLElement {

    constructor() {
        super();

        LoadParticles(['ptc-color-picker']);


        this._horizontaOffset = 0
        this._verticalOffset = 0
        this._blur = 0
        this._spread = 0
        this._color = '#000000'

        this._value = 'none';

        this._name = null;

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
                let output = ``;
                this.shadowData.map((shadow, i) => {
                    output += `${shadow.isInset ? 'inset' : ''} ${shadow.horizontalOffset}px ${shadow.verticalOffset}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
                    output += i < this.shadowData.length - 1 ? ',' : '';
                })
                return output;
            },
            set: (val) => {
                this.clearShadowUI()
                if (val) {
                    // first split the many possible box-shadows
                    let boxShadows = val.split(/,(?![^\(]*\))/);
                    // then split each box-shadow into its own array
                    this.shadowData = boxShadows.map(shadow => {
                        let shadowArray = shadow.trim().split(/ (?![^\(]*\))/);
                        const isInset = shadowArray[0] === 'inset';
                        if (isInset) {
                            shadowArray.shift();
                        }
                        return {
                            isInset: isInset,
                            horizontalOffset: parseInt(shadowArray[0].replace('px', '')),
                            verticalOffset: parseInt(shadowArray[1].replace('px', '')),
                            blur: parseInt(shadowArray[2].replace('px', '')),
                            spread: parseInt(shadowArray[3].replace('px', '')),
                            color: shadowArray[4]
                        }
                    });

                    this.shadowData.forEach((shadow, i) => {
                        createShadowInstance(shadow, i);
                    })
                }
            }
        })

        this._shadow = this.attachShadow({ mode: 'open' })

        const styles = document.createElement('style')
        styles.innerHTML = Css
        this._shadow.appendChild(styles)

        const fontawesome = document.createElement('link')
        fontawesome.setAttribute('rel', 'stylesheet')
        fontawesome.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css')
        this._shadow.appendChild(fontawesome)

        this.shadowsContainer = document.createElement('div');
        this._shadow.appendChild(this.shadowsContainer);

        this.clearShadowUI = () => {
            while (this.shadowsContainer.firstChild) {
                this.shadowsContainer.removeChild(this.shadowsContainer.firstChild);
            }
        }

        this.createShadowString = () => {
            let output = ``;
            this.shadowData.map((shadow, i) => {
                output += `${shadow.isInset ? 'inset' : ''} ${shadow.horizontalOffset}px ${shadow.verticalOffset}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
                output += i < this.shadowData.length - 1 ? ',' : '';
            })
            return output;
        }

        const createShadowInstance = (instanceValue, i) => {
            const instanceContainer = document.createElement('div');
            instanceContainer.classList.add('instance-container');

            instanceContainer.innerHTML = `
            <div class="shadow-header">
            <h4>Shadow ${i + 1}</h4>
            <button class="remove-shadow" title="Remove Shadow"><i class="fa-solid fa-xmark"></i></button>
            </div>
            `
            instanceContainer.querySelector('.remove-shadow').addEventListener('click', () => {
                this.shadowsContainer.removeChild(instanceContainer);
                this.shadowData.splice(i, 1)
                const newValue = this.createShadowString()
                fireEvent(this, 'change', newValue);
            })

            const createShadowInput = (label, fn, initialValue, min = false) => {
                const labelElement = document.createElement('label')
                labelElement.innerHTML = label
                const inputElement = document.createElement('input')
                inputElement.type = 'number'
                inputElement.addEventListener('change', fn)
                inputElement.value = initialValue
                if (min!==false) {
                    inputElement.min = min
                }
                const container = document.createElement('div')
                container.appendChild(labelElement)
                container.appendChild(inputElement)
                return container
            };

            const changeShadowArg = (arg, e) => {
                this.shadowData[i][arg] = (e.detail && e.detail.value) ? e.detail.value : e.target.value
                const newValue = this.createShadowString()
                fireEvent(this, 'change', newValue);
            }

            const hoi = createShadowInput('X', (e) => { changeShadowArg('horizontalOffset', e) }, instanceValue.horizontalOffset)
            instanceContainer.appendChild(hoi)


            const voi = createShadowInput('Y', (e) => { changeShadowArg('verticalOffset', e) }, instanceValue.verticalOffset)
            instanceContainer.appendChild(voi)

            const bli = createShadowInput('B', (e) => { changeShadowArg('blur', e) }, instanceValue.blur, 0)
            instanceContainer.appendChild(bli)

            const spi = createShadowInput('S', (e) => { changeShadowArg('spread', e) }, instanceValue.spread, 0)
            instanceContainer.appendChild(spi)

            const cow = document.createElement('div');
            cow.classList.add('flex')
            cow.classList.add('span-2')

            const attrName = this.getAttribute('name');
            if (attrName) {
                this.name = attrName;
            }

            const cowLabel = document.createElement('label')
            cowLabel.innerHTML = 'C'
            cow.appendChild(cowLabel)

            const coli = document.createElement('ptc-color-picker');
            coli.value = instanceValue.color;
            coli.addEventListener('change', (e) => { changeShadowArg('color', e) })
            cow.appendChild(coli)
            instanceContainer.appendChild(cow)

            const iodiv = document.createElement('div');
            iodiv.classList.add('iodiv');
            iodiv.innerHTML = `
            <div>
                <input type="radio" name="io_${i}" value="outset" />
                <label>Outer</label>
            </div>
            <div>
                <input type="radio" name="io_${i}" value="inset" />
                <label>Inner</label>
            </div>
            `
            iodiv.querySelector('input[value="' + (instanceValue.isInset ? 'inset' : 'outset') + '"]').checked = true;
            iodiv.addEventListener('change', (e) => {
                this.shadowData[i].isInset = (e.target.value === 'inset')
                const newValue = this.createShadowString()
                fireEvent(this, 'change', newValue)
            })
            instanceContainer.appendChild(iodiv)

            this.shadowsContainer.appendChild(instanceContainer)
        }

    }


}