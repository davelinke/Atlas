import { parseGradient } from './lib-gradients.js';
import { fireEvent } from './lib-events.js';

const Css = `
.dialog{
    background-color: #fff;
    position: fixed;
    width: 300px;
    min-height: 300px;
    z-index: 9999;
    top: 100px;
    left: calc(50% - 150px);
    padding:8px;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0,0,0,.2);
}

.sample{
    background-image:
        linear-gradient(45deg, #aaaaaa 25%, transparent 25%),
        linear-gradient(-45deg, #aaaaaa 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #aaaaaa 75%),
        linear-gradient(-45deg, transparent 75%, #aaaaaa 75%);
    background-size:16px 16px;
    background-position:0 0,0 8px,8px -8px,8px 0px;
    margin-bottom:8px
}

.sample-gradient{
    width: 100%;
    height:150px;
    border-radius: 2px;
}
`;

export default class PtcGradients extends HTMLElement {

    constructor() {
        super()

        this._value = 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
        Object.defineProperty(this, 'value', {
            get: () => {
                return this._value;
            },
            set: (val) => {
                this._value = val;
                this.setGradient(val);
            }
        })
        this._type = 'linear';

        this.setGradient = () => {
            this.sample.style.backgroundImage = this.value;
            this.controls.style.backgroundImage = this.value;
        }

        this.generateGradientString = (go) => {
            let output = `linear-gradient(${go.angle}`
            go.colorStopList.forEach((cs, i) => {
                output += `, ${cs.color} ${cs.position}`
            })
            output += `)`
            return output;
        }

        this.createSteps = () => {
            const go = parseGradient(this.value);
            go.colorStopList.forEach((cs, i) => {
                const step = document.createElement('div');
                step.classList.add('step');
                step.innerHTML = `
                <div><ptc-color-picker value="${cs.color}"></ptc-color-picker></div>
                <div><input type="text" value="${cs.position}"/></div>
                `
                const stepInput = step.querySelector('input');

                stepInput.addEventListener('focus', (e) => {
                  fireEvent(this, 'toggleKeyboardShortcuts', false)
                })
            
                stepInput.addEventListener('blur', (e) => {
                  fireEvent(this, 'toggleKeyboardShortcuts', true)
                })
                stepInput.addEventListener('change', (e) => {
                    const pos = e.target.value;
                    cs.position = pos;
                    this.value = this.generateGradientString(go);
                });

                const colorInput = step.querySelector('ptc-color-picker');
                colorInput.addEventListener('change', (e) => {
                    const color = e.detail.value;
                    cs.color = color;
                    this.value = this.generateGradientString(go);
                });
                this.steps.appendChild(step);
            });
        }

        // attach shadow dom
        this._shadow = this.attachShadow({ mode: 'open' })

        const styles = document.createElement('style')
        styles.innerHTML = Css
        this._shadow.appendChild(styles)

        this.wrap = document.createElement('div')
        this.wrap.classList.add('dialog')
        this.wrap.innerHTML = `
<div class="sample">
    <div class="sample-gradient"></div>
</div>
<div class="options">
<div class="options-type">
    <input type="radio" name="type" value="linear" id="linear" checked>
    <label for="linear">Linear</label>
    <input type="radio" name="type" value="radial" id="radial">
    <label for="radial">Radial</label>
    <input type="radio" name="type" value="conical" id="conical">
    <label for="conical">Conical</label>
</div>
<div class="options-direction">
    <input type="number" name="direction" value="0" id="direction"> °
    <label for="direction">Angle</label>
</div>
</div>
<div class="controls"></div>
<div class="steps"></div>
<div class="swatches"></div>
      `
        this.sample = this.wrap.querySelector('.sample-gradient')
        this.controls = this.wrap.querySelector('.controls')
        this.steps = this.wrap.querySelector('.steps')

        this.setGradient();
        this.createSteps();

        this._shadow.appendChild(this.wrap)
    }

    connectedCallback() {
        const style = document.createElement('style')
        style.textContent = Css
        this.appendChild(style)
    }
}