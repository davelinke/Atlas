import { LoadParticles } from "./lib-loader.js";

const Css = `
:host{
    display: inline-grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-row-gap:0.75rem;
    font-size: 12px;;
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
                const output = ``;
                this.shadowData.map(shadow, i => {
                    output += `${shadow.isInset?'inset':''} ${shadow.horizontalOffset}px ${shadow.verticalOffset}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
                    output += i < this.shadowData.length - 1 ? ',' : '';
                })
                return output;
            },
            set: (val) => {
                // first split the many possible box-shadows
                let boxShadows = val.split(/,(?![^\(]*\))/);
                // then split each box-shadow into its own array
                const shadowData = boxShadows.map(shadow => {
                    let shadowArray = shadow.trim().split(' ');
                    const isInset = shadowArray[0] === 'inset';
                    if (isInset) {
                        shadowArray.shift();
                    }
                    return {
                        isInset: isInset,
                        horizontalOffset: shadowArray[0],
                        verticalOffset: shadowArray[1],
                        blur: shadowArray[2],
                        spread: shadowArray[3],
                        color: shadowArray[4]
                    }
                });
                this.shadowData = shadowData;
            }
        })

        this._shadow = this.attachShadow({ mode: 'open' })

        const styles = document.createElement('style')
        styles.innerHTML = Css
        this._shadow.appendChild(styles)



        this.setHorizontalOffset = (e) => {
            console.log(e.target.value)
        }
        this.setVerticalOffset = (e) => {
            console.log(e.target.value)
        }
        this.setBlur = (e) => {
            console.log(e.target.value)
        }
        this.setSpread = (e) => {
            console.log(e.target.value)
        }
        this.setColor = (e) => {
            console.log(e.target.value)
        }

        this.createShadowInput = (label,fn) => {
            const labelElement = document.createElement('label')
            labelElement.innerHTML = label
            const inputElement = document.createElement('input')
            inputElement.type = 'number'
            inputElement.addEventListener('change',fn)
            const container = document.createElement('div')
            container.appendChild(labelElement)
            container.appendChild(inputElement)
            return container
        };

        const hoi = this.createShadowInput('X',this.setHorizontalOffset)
        this._shadow.appendChild(hoi)

        const voi = this.createShadowInput('Y',this.setVerticalOffset)
        this._shadow.appendChild(voi)
        
        const bli = this.createShadowInput('B',this.setBlur)
        this._shadow.appendChild(bli)
        
        const spi = this.createShadowInput('S',this.setSpread)
        this._shadow.appendChild(spi)

        const cow = document.createElement('div');
        cow.classList.add('flex')
        cow.classList.add('span-2')

        const cowLabel = document.createElement('label')
        cowLabel.innerHTML = 'C'
        cow.appendChild(cowLabel)
        
        const coli = document.createElement('ptc-color-picker');
        coli.value = this._color
        coli.addEventListener('change', this.setColor)
        cow.appendChild(coli)
        this._shadow.appendChild(cow)

    }


}