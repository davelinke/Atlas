import { parseGradient } from './lib-gradients.js';
import { fireEvent } from './lib-events.js';
import angleImg from './img-angle.js';

const Css = `
:host {
    font-size:12px;
}
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
.options{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 8px;
}
.options-direction{
    display: none;
}
.linear .options-direction{
    display: block;
}

.options-radial-type,
.options-repeat{
    display: none;
}
.radial .options-radial-type{
    display: block;
}

.radial .options-repeat,
.conical .options-repeat{
    display: inline-flex;
    align-items: center;
}

select{
    border: none;
    background-color: #efefef;
    border-radius: 3px;
    padding: 0;
    line-height: 0;
    height: 23px;
    outline: none;
    width: 100%;
}
.input-wrap {
    display: inline-flex;
    background-color: #efefef;
    border-radius: 3px;
    height: 23px;
    align-items: center;
    width: 100%;
}
.input-wrap > * {
    height: 100%;
    cursor: text;
}
.input-label {
    display: inline-flex;
    padding: 0 4px;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}
input[type=number],
input[type=text] {
    width: 24px;
    border: none;
    background-color: transparent;
    font-family: inherit;
    font-size: 12px;
    padding: 0;
    text-align: end;
    outline: none;
    flex: 1 1 auto;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
}
.input-label {
    display: inline-flex;
    padding: 0 4px;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    line-height: 12px;
}
.step{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    background-color: #efefef;
    margin-bottom: 8px;
    padding: 4px;
    align-items: center;
    border-radius: 4px;
}
.step .input-wrap{
    background-color: #fff;
}
.heading {
    font-weight: 500;
    font-size: 0.75rem;
    text-transform: uppercase;
    grid-column: span 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block-end: 12px;
}
.heading button {
    background: none;
    border: none;
    cursor: pointer;
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
                this.setGradient();
            }
        })
        this._type = 'linear';
        Object.defineProperty(this, 'type', {
            get: () => {
                return this._type;
            },
            set: (val) => {
                this._type = val;
                const gradientString = this.generateGradientString();
                this.value = gradientString;
            }
        })

        this._angle = '90deg';
        Object.defineProperty(this, 'angle', {
            get: () => {
                return this._angle;
            },
            set: (val) => {
                this._angle = val;
                this.angleInput.value = parseInt(val.replace('deg', ''));
                this.setGradient();
            }
        })

        this._radialType = 'ellipse';
        Object.defineProperty(this, 'radialType', {
            get: () => {
                return this._radialType;
            },
            set: (val) => {
                this._radialType = val;
                const gradientString = this.generateGradientString();
                this.value = gradientString;
            }
        })

        this._repeat = false;
        Object.defineProperty(this, 'repeat', {
            get: () => {
                return this._repeat;
            },
            set: (val) => {
                this._repeat = val;
                const gradientString = this.generateGradientString();
                this.value = gradientString;
            }
        })

        this.setGradient = () => {
            const sample = this.sample;
            sample.style.backgroundImage = this.value;
            this.controls.style.backgroundImage = this.value;
            fireEvent(this, 'change', this.value)
        }

        this.generateGradientObject = () => {
            const steps = [];
            this.steps.querySelectorAll('.step').forEach(step => {
                const color = step.querySelector('ptc-color-picker').value;
                const position = step.querySelector('.input-position').value;
                steps.push({
                    color,
                    position
                })
            });
            const go = {
                angle: this.angle,
                colorStopList: steps
            }
            return go;
        };

        this.generateGradientString = (go = this.generateGradientObject()) => {

            const type = this.type;
            let output = ``;

            if (type === 'linear') {
                output += `linear-gradient(${go.angle}`
                go.colorStopList.forEach((cs, i) => {
                    output += `, ${cs.color} ${cs.position}%`
                })
                output += `)`
            }
            if (type === 'radial') {
                output += this.repeat ? `repeating-` : ``
                output += `radial-gradient(${this.radialType}`
                go.colorStopList.forEach((cs, i) => {
                    output += `, ${cs.color} ${cs.position}%`
                })
                output += `)`
            }
            if (type === 'conical') {
                output += this.repeat ? `repeating-` : ``
                output += `conic-gradient(at 50% 50%`
                go.colorStopList.forEach((cs, i) => {
                    output += `, ${cs.color} ${cs.position*360/100}deg`
                })
                output += `)`
            }
            console.log(output)
            return output;
        }

        this.createStep = (cs, i)=>{
            const go = this.gradientObject;
            const step = document.createElement('div');
            step.classList.add('step');
            const position = parseInt(cs.position) * 1

            step.innerHTML = `
            <div><ptc-color-picker value="${cs.color}"></ptc-color-picker></div>
            <div class="input-wrap"><label class="input-label">P</label><input class="input-position" type="number" min="0" max="100" value="${position}"/><label class="input-label">%</label></div>
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
                this.value = this.generateGradientString();
            });

            const colorInput = step.querySelector('ptc-color-picker');
            colorInput.addEventListener('change', (e) => {
                const color = e.detail.value;
                cs.color = color;
                this.value = this.generateGradientString();
            });

            return step;
        }

        this.addStep = ()=> {
            const go = this.gradientObject;
            const stepData = {
                color: 'rgba(0,0,0,1)',
                position: '100'
            }
            go.colorStopList.push(stepData)
            const step = this.createStep(stepData, go.colorStopList.length - 1);
            this.steps.appendChild(step);
            this.value = this.generateGradientString();
        }

        this.createSteps = () => {
            this.gradientObject = parseGradient(this.value);
            this.angle = this.gradientObject.angle;
            this.gradientObject.colorStopList.forEach((cs, i) => {
                const step = this.createStep(cs,i);
                this.steps.appendChild(step);
            });
        }

        // attach shadow dom
        this._shadow = this.attachShadow({ mode: 'open' })

        const styles = document.createElement('style')
        styles.innerHTML = Css
        this._shadow.appendChild(styles)

        const fontawesome = document.createElement('link')
        fontawesome.setAttribute('rel', 'stylesheet')
        fontawesome.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css')
        this._shadow.appendChild(fontawesome)

        this.wrap = document.createElement('div')
        this.wrap.setAttribute('class', 'dialog linear')
        this.wrap.innerHTML = `
<div class="sample">
    <div class="sample-gradient"></div>
</div>
<div class="options">
    <div class="options-type">
        <select id="type" name="type">
            <option value="linear" selected>Linear</option>
            <option value="radial">Radial</option>
            <option value="conical">Conical</option>
        </select>
    </div>
    <div class="options-radial-type">
        <select id="radial-type" name="radial-type">
            <option value="ellipse" selected>Ellipse</option>
            <option value="circle">Circle</option>
        </select>
    </div>
    <div class="options-repeat">
        <input type="checkbox" id="repeat" name="repeat" /> <label for="repeat">Repeat</label>
    </div>
    <div class="options-direction">
        <div class="input-wrap">
            <label class="input-label" for="direction">
                <img src="${angleImg}" width="12" height="12" alt="Angle" />
            </label>
            <input type="number" name="direction" value="0" id="direction">
            <label class="input-label">°</label>
        </div>
    </div>
</div>
<div class="controls"></div>
<div class="heading">Steps<button class="add-button"><i class="fa-solid fa-plus"></i></button></div>
<div class="steps"></div>
<div class="swatches"></div>
      `
        this.sample = this.wrap.querySelector('.sample-gradient')
        this.controls = this.wrap.querySelector('.controls')
        this.steps = this.wrap.querySelector('.steps')
        this.typeSelect = this.wrap.querySelector('#type')
        this.stepsAddButton = this.wrap.querySelector('.add-button')

        this.stepsAddButton.addEventListener('click', (e) => {
            this.addStep()
        })


        this.typeSelect.addEventListener('change', (e) => {
            const type = e.target.value;
            this.wrap.setAttribute('class', `dialog ${type}`)
            this.type = e.target.value;
        })

        this.angleInput = this.wrap.querySelector('#direction');
        this.angleInput.addEventListener('focus', (e) => {
            fireEvent(this, 'toggleKeyboardShortcuts', false)
        })

        this.angleInput.addEventListener('blur', (e) => {
            fireEvent(this, 'toggleKeyboardShortcuts', true)
        })
        this.angleInput.addEventListener('change', (e) => {
            const angle = e.target.value;
            this.angle = angle + 'deg';
            const val = this.generateGradientString();
            console.log(val)
            this.value = val
        })

        this.radialTypeSelect = this.wrap.querySelector('#radial-type')
        this.radialTypeSelect.addEventListener('change', (e) => {
            this.radialType = e.target.value;
        })

        this.repeatCheckbox = this.wrap.querySelector('#repeat')
        this.repeatCheckbox.addEventListener('change', (e) => {
            this.repeat = e.target.checked;
        });
        this.repeatCheckbox.nextSibling.addEventListener('click', (e) => {
            this.repeatCheckbox.checked = !this.repeatCheckbox.checked;
        });

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