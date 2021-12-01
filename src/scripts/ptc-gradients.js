import { parseGradient } from './lib-gradients.js';
import { fireEvent } from './lib-events.js';
import angleImg from './img-angle.js';
import { arrayMove } from './lib-utils.js';

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
    padding:8px 8px 0;
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
.options,
.settings{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-column-gap: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 8px;
}
.options-direction{
    display: none;
}
.linear .options-direction,
.conic .options-direction{
    display: block;
}

.options-radial-type,
.options-repeat{
    display: none;
}
.radial .options-radial-type{
    display: block;
}

.options-position-x,
.options-position-y{
    display: none;
}
.radial .options-position-x,
.radial .options-position-y,
.conic .options-position-x,
.conic .options-position-y{
    display: block;
}

.radial .options-repeat,
.conic .options-repeat{
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
input[type=number],
input[type=text] {
    width: 100%;
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
    line-height: 13px;
}
.step{
    display: flex;
    background-color: #efefef;
    padding: 4px;
    align-items: center;
    border-radius: 4px;
}
.step > div{
    margin-inline-end: 8px;
}
.step > div:last-child{
    margin-inline-end: 0;
}
.step:last-child{
    margin-bottom: 0;
}
.step .input-wrap{
    background-color: #fff;
}
.heading {
    font-weight: 500;
    font-size: 0.75rem;
    text-transform: uppercase;
    grid-column: span 4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block-end: 12px;
}
.heading.heading-steps{
    margin-block-end: 0;
}
.heading button {
    background: none;
    border: none;
    cursor: pointer;
}
.unit{
    cursor: pointer;
    min-width: 12px;
}
.step-remove{
    display:flex;
    align-items: center;
    justify-content: flex-end;
}
.step-remove-button {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    display: flex;
    height: 24px;
    width: 24px;
    align-items: center;
    justify-content: center;
    padding: 0;
}
.step-color{
    display: flex;
    align-items: center;
}
.steps.no-remove .step-remove-button{
    opacity:.1;
    pointer-events: none;
}
.step-handle{
    width: 32px;
    display: flex;
    align-items:center;
    justify-content: center;
    opacity: 0.3;
}
.step-drop-zone{
    height: 8px;
}
.step-drop-zone.drag-over{
    height: 44px;
}
`;

const units = {
    'px': 'px',
    '%': '%',
    'deg': '°'
}

export default class PtcGradients extends HTMLElement {

    constructor() {
        super()

        this._value = 'conic-gradient(from 45deg at 100px 30%, rgba(255,0,0,1) 0deg, rgba(0,255,0,1) 90deg, rgba(0,0,255,1) 180deg, rgba(255,0,0,1) 270deg)'
        Object.defineProperty(this, 'value', {
            get: () => {
                return this._value;
            },
            set: (val) => {
                console.log(val)
                this._value = val;
                this.sample.style.backgroundImage = val;
                this.controls.style.backgroundImage = val;
                fireEvent(this, 'change', val)
            }
        })
        this._type = 'linear';
        Object.defineProperty(this, 'type', {
            get: () => {
                return this._type;
            },
            set: (val = 'linear') => {
                console.log(this._type, val)
                let reRenderSteps = false;
                // convert px values to percentages in conic only
                const pxSteps = this.gradientObject.colorStopList.filter(cs => cs.unit === 'px')

                const stepsPctToDeg = (create = false) => {
                    this.gradientObject.colorStopList.forEach(cs => {
                        if (cs.unit !== 'deg') {
                            cs.unit = 'deg'
                            cs.position = cs.position * 360 / 100
                        }
                    })
                    this._type = val;
                    this.value = this.generateGradientString();
                }

                const stepsDegToPct = () => {
                    reRenderSteps = true;
                    this.gradientObject.colorStopList.forEach(cs => {
                        cs.unit = '%'
                        cs.position = cs.position * 100 / 360
                    })
                    this._type = val;
                    this.value = this.generateGradientString();
                }

                if (val !== 'conic' && this._type === 'conic') {
                    reRenderSteps = true;
                    stepsDegToPct();
                }
                if (val === 'conic' && this._type !== 'conic') {
                    reRenderSteps = true;
                    if (pxSteps.length) {
                        reRenderSteps = true; const confirm = window.confirm('Conic gradients cannot have px values. Convert to degrees?')
                        if (confirm) {
                            stepsPctToDeg(true);
                        } else {
                            return
                        }
                    }
                    stepsPctToDeg();
                }
                if (val !== 'conic' && this._type !== 'conic') {
                    this._type = val;
                    this.value = this.generateGradientString();
                }
                this.wrap.setAttribute('class', `dialog ${this._type}`)
                this.typeSelect.value = this._type;
                console.log(reRenderSteps)
                reRenderSteps && this.createSteps();
            }
        })

        this._angle = '0deg';
        Object.defineProperty(this, 'angle', {
            get: () => {
                return this._angle;
            },
            set: (val = '0deg') => {
                this._angle = val;
                this.angleInput.value = parseInt(val.replace('deg', ''));
                this.value = this.generateGradientString();
            }
        })

        this._radialType = 'ellipse';
        Object.defineProperty(this, 'radialType', {
            get: () => {
                return this._radialType;
            },
            set: (val = 'ellipse') => {
                this._radialType = val;
                const gradientString = this.generateGradientString();
                this.value = gradientString;
                this.radialTypeSelect.value = this._radialType;
            }
        })

        this._repeat = false;
        Object.defineProperty(this, 'repeat', {
            get: () => {
                return this._repeat;
            },
            set: (val = false) => {
                this._repeat = val;
                const gradientString = this.generateGradientString();
                this.value = gradientString;
                this.repeatCheckbox.checked = this._repeat;
            }
        })

        this._positionX = 50;
        Object.defineProperty(this, 'positionX', {
            get: () => {
                return this._positionX;
            },
            set: (val = 50) => {
                this._positionX = val;
                this.positionXInput.value = val;
                const gradientString = this.generateGradientString();
                this.value = gradientString;
            }
        })

        this._positionXUnit = '%';
        Object.defineProperty(this, 'positionXUnit', {
            get: () => {
                return this._positionXUnit;
            },
            set: (val = '%') => {
                this._positionXUnit = val;
                this.positionXUnitSelect.innerText = val;
                const gradientString = this.generateGradientString();
                this.value = gradientString;
            }
        })

        this._positionY = 50;
        Object.defineProperty(this, 'positionY', {
            get: () => {
                return this._positionY;
            },
            set: (val = 50) => {
                this._positionY = val;
                this.positionYInput.value = val;
                const gradientString = this.generateGradientString();
                this.value = gradientString;
            }
        })

        this._positionYUnit = '%';
        Object.defineProperty(this, 'positionYUnit', {
            get: () => {
                return this._positionYUnit;
            },
            set: (val = '%') => {
                this._positionYUnit = val;
                this.positionYUnitSelect.innerText = val;
                const gradientString = this.generateGradientString();
                this.value = gradientString;
            }
        })

        this.generateGradientString = () => {
            const go = this.gradientObject;
            const type = this.type;
            let output = ``;

            if (type === 'linear') {
                output += `linear-gradient(${go.angle}`
                go.colorStopList.forEach((cs, i) => {
                    output += `, ${cs.color} ${cs.position}${cs.unit}`
                })
                output += `)`
            }
            if (type === 'radial') {
                output += this.repeat ? `repeating-` : ``
                output += `radial-gradient(`
                output += this.radialType ? this.radialType : 'ellipse'
                output += this.positionX ? ` at ${this.positionX}${this.positionXUnit}` : ''
                output += this.positionY ? ` ${this.positionY}${this.positionYUnit}` : ''
                go.colorStopList.forEach((cs, i) => {
                    output += `, ${cs.color} ${cs.position}${cs.unit}`
                })
                output += `)`
            }
            if (type === 'conic') {
                output += this.repeat ? `repeating-` : ``
                output += `conic-gradient(`
                output += this.angle ? 'from ' + this.angle : 'from 0deg'
                output += this.positionX ? ` at ${this.positionX}${this.positionXUnit}` : ''
                output += this.positionY ? ` ${this.positionY}${this.positionYUnit}` : ''
                go.colorStopList.forEach((cs, i) => {
                    output += `, ${cs.color} ${cs.position}deg`
                })
                output += `)`
            }
            return output;
        }

        this.checkMinSteps = () => {
            if (this.gradientObject.colorStopList.length < 3) {
                this.steps.classList.add('no-remove')
            } else {
                this.steps.classList.remove('no-remove')
            }
        }

        this.createDropZone = (i) => {
            const go = this.gradientObject;
            const dropZone = document.createElement('div');
            dropZone.classList.add('step-drop-zone');
            dropZone.dataset.index = i;

            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const theIndex = e.dataTransfer.getData('text/plain');
                if (theIndex !== i) {
                    e.dataTransfer.dropEffect = 'move';
                    dropZone.classList.add('drag-over');
                }
            });
            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('drag-over');
            });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('drag-over');
                const draggedStepIndex = e.dataTransfer.getData('text/plain');
                console.log('dragging element', draggedStepIndex);
                console.log('throwing into', i);
                const newIndex = (draggedStepIndex > i) ? i + 1 : i;
                arrayMove(go.colorStopList, draggedStepIndex, newIndex);
                this.value = this.generateGradientString();

                this.createSteps(false);
            });

            return dropZone;
        }

        this.createStep = (cs, i) => {
            const go = this.gradientObject;
            const step = document.createElement('div');

            step.innerHTML = `
            <div class="step" draggable="true" id="step-${i}" data-index="${i}">
                <div class="step-handle"><i class="fa-solid fa-grip-vertical"></i></div>
                <div class="step-color"><ptc-color-picker value="${cs.color}"></ptc-color-picker></div>
                <div class="input-wrap"><label class="input-label">Position</label><input class="input-position" type="number" min="0" value="${cs.position ? cs.position : 0}"/><label class="input-label unit">${units[cs.unit]}</label></div>
                <div class="step-remove"><button class="step-remove-button"><i class="fa-solid fa-xmark"></i></button></div>
            </div>
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

            const unitLabel = step.querySelector('.unit');
            unitLabel.addEventListener('click', (e) => {
                if (this.type !== 'conic') {
                    if (cs.unit === '%') {
                        cs.unit = 'px';
                        unitLabel.innerText = 'px';
                    } else {
                        cs.unit = '%';
                        unitLabel.innerText = '%';
                    }
                    this.value = this.generateGradientString();
                }
            })

            const colorInput = step.querySelector('ptc-color-picker');
            colorInput.addEventListener('change', (e) => {
                const color = e.detail.value;
                cs.color = color;
                this.value = this.generateGradientString();
            });

            const removeButton = step.querySelector('.step-remove-button');
            removeButton.addEventListener('click', (e) => {
                this.steps.removeChild(step);
                go.colorStopList.splice(i, 1);
                this.value = this.generateGradientString();

                this.checkMinSteps();
            });

            const dragItem = step.querySelector('.step');

            dragItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.index);
                e.dataTransfer.effectAllowed = 'move';
            });

            return step;
        }

        this.addStep = () => {
            const go = this.gradientObject;
            const stepData = {
                color: 'rgba(0,0,0,1)',
                position: 100,
                unit: '%'
            }
            go.colorStopList.push(stepData)
            const step = this.createStep(stepData, go.colorStopList.length - 1);
            this.steps.appendChild(step);
            this.value = this.generateGradientString();
            this.checkMinSteps();
        }

        this.createSteps = () => {
            this.steps.innerHTML = '';
            this.gradientObject.colorStopList.forEach((cs, i) => {
                const step = this.createStep(cs, i);
                const dropZone = this.createDropZone(i);
                if (i === 0) {
                    this.steps.appendChild(this.createDropZone(-1));
                }
                this.steps.appendChild(step);
                this.steps.appendChild(dropZone);
            });

            this.gradientObject.colorStopList.appendChild
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
<div class="heading">Type</div>
    <div class="options-type">
        <select id="type" name="type">
            <option value="linear" selected>Linear</option>
            <option value="radial">Radial</option>
            <option value="conic">Conic</option>
        </select>
    </div>
</div>
<div class="settings">
    <div class="heading">Settings</div>
    <div class="options-radial-type">
        <select id="radial-type" name="radial-type">
            <option value="ellipse" selected>Ellipse</option>
            <option value="circle">Circle</option>
        </select>
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
    <div class="options-position-x">
        <div class="input-wrap">
            <label class="input-label" for="position-x">
                X
            </label>
            <input type="number" name="position-x" value="50" id="position-x">
            <label class="input-label unit" id="position-x-unit">%</label>
        </div>
    </div>
    <div class="options-position-y">
        <div class="input-wrap">
            <label class="input-label" for="position-y">
                Y
            </label>
            <input type="number" name="position-y" value="50" id="position-y">
            <label class="input-label unit" id="position-y-unit">%</label>
        </div>
    </div>
    <div class="options-repeat">
        <input type="checkbox" id="repeat" name="repeat" /> <label for="repeat">Repeat</label>
    </div>
</div>
<div class="controls"></div>
<div class="heading heading-steps">Steps<button class="add-button"><i class="fa-solid fa-plus"></i></button></div>
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

        this.positionXInput = this.wrap.querySelector('#position-x')
        this.positionXInput.addEventListener('focus', (e) => {
            fireEvent(this, 'toggleKeyboardShortcuts', false)
        })
        this.positionXInput.addEventListener('blur', (e) => {
            fireEvent(this, 'toggleKeyboardShortcuts', true)
        })
        this.positionXInput.addEventListener('change', (e) => {
            this.positionX = e.target.value;
        })

        this.positionXUnitSelect = this.wrap.querySelector('#position-x-unit')
        this.positionXUnitSelect.addEventListener('click', (e) => {
            const newUnit = e.target.innerText === '%' ? 'px' : '%';
            this.positionXUnit = newUnit;
            this.positionXUnitSelect.innerText = newUnit;
        })

        this.positionYInput = this.wrap.querySelector('#position-y')
        this.positionYInput.addEventListener('focus', (e) => {
            fireEvent(this, 'toggleKeyboardShortcuts', false)
        })
        this.positionYInput.addEventListener('blur', (e) => {
            fireEvent(this, 'toggleKeyboardShortcuts', true)
        })
        this.positionYInput.addEventListener('change', (e) => {
            this.positionY = e.target.value;
        })

        this.positionYUnitSelect = this.wrap.querySelector('#position-y-unit')
        this.positionYUnitSelect.addEventListener('click', (e) => {
            const newUnit = e.target.innerText === '%' ? 'px' : '%';
            this.positionYUnit = newUnit;
            this.positionYUnitSelect.innerText = newUnit;
        })

        if (this.value) {
            this.gradientObject = parseGradient(this.value);
            this.type = this.gradientObject.type;
            this.angle = this.gradientObject.angle;
            this.radialType = this.gradientObject.shape;
            if (this.gradientObject.position) {
                this.positionX = this.gradientObject.position.x.value;
                this.positionXUnit = this.gradientObject.position.x.unit;
                this.positionY = this.gradientObject.position.y?.value;
                this.positionYUnit = this.gradientObject.position.y?.unit;
            }
            this.createSteps();
        }


        this._shadow.appendChild(this.wrap)
    }

    connectedCallback() {
        const style = document.createElement('style')
        style.textContent = Css
        this.appendChild(style)
    }
}