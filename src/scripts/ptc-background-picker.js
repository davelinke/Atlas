import { LoadParticles } from "./lib-loader.js";
import { fireEvent } from './lib-events.js'

const Css = `
`

export default class PtcBackgroundPicker extends HTMLElement {
    constructor() {
        super();

        /**
         * DEPENDENCIES
         */

        LoadParticles(['ptc-color-picker', 'ptc-gradients']);

        /**
         * PROPERTIES
         */

        this.bgData = null

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

        this._value = `#ff0000, conic-gradient(from 45deg at 100% 30%, rgba(255,0,0,1) 0deg, rgba(0,255,0,1) 90deg, rgba(0,0,255,1) 180deg, rgba(255,0,0,1) 270deg), url(/assets/icon.png)`;
        Object.defineProperty(this, 'value', {
            get: () => {
                let output = ``;
                if (this.bgData) {
                    this.bgData.map((bg, i) => {
                        output += ``;
                        output += i < this.bgData.length - 1 ? ',' : '';
                    })
                }
                return output;
            },
            set: (val) => {
                this.clearBgUI()
                if (val) {
                    this._value = val;
                    this.setBgData(val);
                    this.renderBgInstances()
                }
            }
        })

        /**
         * METHODS
         */

        this.clearBgUI = () => {
            while (this.bgsContainer.firstChild) {
                this.bgsContainer.removeChild(this.bgsContainer.firstChild);
            }
        }

        this.setBgData = (val) => {
            // first split the many possible backgrounds
            let backgrounds = val.split(/(?![^(]*\)),/g);
            console.log('backgrounds', backgrounds)
            // then split each bg into its own array
            this.bgData = backgrounds.map(bg => {
                const output = {
                    type: null,
                    value: null
                }
                if (bg.indexOf(/url/) > -1) {
                    output.type = 'image'
                } else if (bg.indexOf(/gradient/) > -1) {
                    output.type = 'gradient'
                } else {
                    output.type = 'color'
                }
                output.value = bg
                return output
            });
        }

        this.renderBgInstances = () => {
            this.clearBgUI()

            this.bgData.forEach((bg, i) => {
                this.createBgInstance(bg, i);
            })
        }

        this.createBgInstance = (bg, i) => {
            const instanceContainer = document.createElement('div');
            instanceContainer.classList.add('instance-container');

            instanceContainer.innerHTML = `
            <div class="shadow-header">
            <h4>Background ${i + 1}</h4>
            <button class="remove-bg" title="Remove Background"><i class="fa-solid fa-xmark"></i></button>
            </div>
            `
            instanceContainer.querySelector('.remove-bg').addEventListener('click', () => {
                this.bgsContainer.removeChild(instanceContainer);
                this.bgData.splice(i, 1)
                const newValue = this.createBgString()
                fireEvent(this, 'change', newValue);
            })

            const bgType = bg.type;
            const bgValue = bg.value;

            if (bgType === 'image') {

            } else if (bgType === 'gradient') {
                const picker = document.createElement('ptc-gradients');
                picker.setAttribute('name', `${this.name}-bg-${i}`);
                picker.setAttribute('value', bgValue);
                picker.addEventListener('change', (e) => {
                    console.log(e);
                    // const newValue = this.createBgString()
                    // fireEvent(this, 'change', newValue);
                })
            } else if (bgType === 'color') {
                const picker = document.createElement('ptc-color-picker');
                picker.setAttribute('name', `${this.name}-bg-${i}`);
                picker.setAttribute('value', bgValue);
                picker.addEventListener('change', (e) => {
                    console.log(e);
                    // const newValue = this.createBgString()
                    // fireEvent(this, 'change', newValue);
                })
            }
        }


        this.createBgString = () => {
            let output = ``;
            this.bgData.map((shadow, i) => {
                output += ``;
                output += i < this.shadowData.length - 1 ? ',' : '';
            })
            return output;
        }

        /**
         * UI
         */

        this._shadow = this.attachShadow({ mode: 'open' })

        const styles = document.createElement('style')
        styles.innerHTML = Css
        this._shadow.appendChild(styles)

        const fontawesome = document.createElement('link')
        fontawesome.setAttribute('rel', 'stylesheet')
        fontawesome.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css')
        this._shadow.appendChild(fontawesome)

        this.bgsContainer = document.createElement('div');
        this._shadow.appendChild(this.bgsContainer);

        if (this.value) {

        }
    }
}