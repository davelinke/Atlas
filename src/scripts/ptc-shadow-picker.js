import { LoadParticles } from "./lib-loader.js";
import { fireEvent } from './lib-events.js'

const Css = `
.instance-container{
    display: inline-grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-row-gap:0.75rem;
    font-size: 12px;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #ccc;
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
label{
    display: inline-block;
    margin-inline: 4px;
}
.flex{
    display: flex;
    align-items: center;
}
.span-2{
  grid-column: span 4;
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
                    console.log(shadow)
                    output += `${shadow.isInset ? 'inset' : ''} ${shadow.horizontalOffset}px ${shadow.verticalOffset}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
                    output += i < this.shadowData.length - 1 ? ',' : '';
                })
                return output;
            },
            set: (val) => {
                // first split the many possible box-shadows
                let boxShadows = val.split(/,(?![^\(]*\))/);
                // then split each box-shadow into its own array
                this.shadowData = boxShadows.map(shadow => {
                    let shadowArray = shadow.trim().split(' ');
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

                this.clearShadowUI()
                this.shadowData.forEach((shadow, i) => {
                    createShadowInstance(shadow, i);
                })
            }
        })

        this._shadow = this.attachShadow({ mode: 'open' })

        const styles = document.createElement('style')
        styles.innerHTML = Css
        this._shadow.appendChild(styles)

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

            const createShadowInput = (label, fn, initialValue) => {
                const labelElement = document.createElement('label')
                labelElement.innerHTML = label
                const inputElement = document.createElement('input')
                inputElement.type = 'number'
                inputElement.addEventListener('change', fn)
                inputElement.value = initialValue
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

            const bli = createShadowInput('B', (e) => { changeShadowArg('blur', e) }, instanceValue.blur)
            instanceContainer.appendChild(bli)

            const spi = createShadowInput('S', (e) => { changeShadowArg('spread', e) }, instanceValue.spread)
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

            this.shadowsContainer.appendChild(instanceContainer)
        }

    }


}