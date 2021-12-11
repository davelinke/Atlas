import { LoadParticles } from "./lib-loader.js";
import { fireEvent } from './lib-events.js'
import pic from './img-beach.js';

const Css = `
.instance-container {
    display: block;
    font-size: 12px;
    margin-block-start: 8px;
    background-color: #fbfbfb;
    border-radius: 4px;
    padding: 4px 6px 6px;
    margin-inline: -6px;
}
.instance-container:first-child {
    margin-block-start: 0;
}
.bg-header {
    grid-column: span 4;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.bg-header h4 {
    margin: 0;
    font-weight: normal;
    text-transform: uppercase;
}
.bg-header button {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-top: -4px;
    margin-right: -4px;
    display: flex;
    height: 24px;
    width: 24px;
    align-items: center;
    justify-content: center;
    padding: 0;
}
.bg-pic-preview {
    width: 100%;
    height: 100px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}
.bg-pic-preview-wrap {
    background-image: linear-gradient(45deg, #aaaaaa 25%, transparent 25%),
        linear-gradient(-45deg, #aaaaaa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #aaaaaa 75%),
        linear-gradient(-45deg, transparent 75%, #aaaaaa 75%);
    background-size: 16px 16px;
    background-position: 0 0, 0 8px, 8px -8px, 8px 0px;
}

.bg-types {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
    grid-column-gap: 8px;
    padding: 12px;
}
.heading button.bg-type {
    width: 75px;
    height: 75px;
    background-color: #efefef;
    border-radius: 3px;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    padding: 0 0 4px 0;
    flex-direction: column;
}
.heading button.bg-type[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}
@media (hover: hover) {
    .heading button.bg-type:not([disabled]):hover {
        background-color: #d5f7ff;
    }
}

.heading {
    font-weight: 500;
    font-size: 0.75rem;
    text-transform: uppercase;
    grid-column: span 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block-end: 8px;
}
.heading button {
    background: none;
    border: none;
    cursor: pointer;
}
.bg-type::before {
    content: "";
    display: block;
    width: 100%;
    height: 51px;
    border-radius: 3px 3px 0 0;
    box-sizing: border-box;
}
.bg-type.bg-color::before {
    background: #ff0076;
}
.bg-type.bg-gradient::before {
    background-image: conic-gradient(
        from 45deg at 100% 30%,
        rgb(255, 0, 0) 0deg,
        rgb(0, 255, 0) 90deg,
        rgb(0, 0, 255) 180deg,
        rgb(255, 0, 0) 270deg
    );
}
.bg-type.bg-image::before {
    background-image: url(${pic});
    background-size: cover;
}
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

        this._value = `rgba(255,0,0,1), conic-gradient(from 45deg at 100% 30%, rgba(255,0,0,1) 0deg, rgba(0,255,0,1) 90deg, rgba(0,0,255,1) 180deg, rgba(255,0,0,1) 270deg), url(/assets/icon.png)`;
        Object.defineProperty(this, 'value', {
            get: () => {
                return this._value;
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
            const splitBg = (string) => {
                var token = /((?:[^"']|".*?"|'.*?')*?)([(,)]|$)/g;
                return (function recurse() {
                    for (var array = []; ;) {
                        var result = token.exec(string);
                        if (result[2] == '(') {
                            array.push(result[1].trim() + '(' + recurse().join(',') + ')');
                            result = token.exec(string);
                        } else array.push(result[1].trim());
                        if (result[2] != ',') return array
                    }
                })()
            }
            // first split the many possible backgrounds
            let backgrounds = splitBg(val);
            // then split each bg into its own array
            this.bgData = backgrounds.map(bg => {
                const output = {
                    type: null,
                    value: null
                }

                if (new RegExp(/url/).test(bg)) {
                    output.type = 'image'
                } else if (new RegExp(/gradient/).test(bg)) {
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
            <div class="bg-header">
            <h4>Background ${i + 1}</h4>
            <button class="remove-bg" title="Remove Background"><i class="fa-solid fa-xmark"></i></button>
            </div>
            `
            instanceContainer.querySelector('.remove-bg').addEventListener('click', () => {
                this.bgsContainer.removeChild(instanceContainer);
                this.bgData.splice(i, 1)
                const bgString = this.createBgString()
                this._value = bgString
                fireEvent(this, 'change', { value: bgString })
            })

            const bgType = bg.type;
            const bgValue = bg.value;

            if (bgType === 'image') {
                const previewWrap = document.createElement('div');
                previewWrap.classList.add('bg-pic-preview-wrap');
                const preview = document.createElement('div');
                preview.classList.add('bg-pic-preview');
                preview.style.backgroundImage = bgValue;
                previewWrap.appendChild(preview);
                instanceContainer.appendChild(previewWrap);
            } else if (bgType === 'gradient') {
                console.log('woot', bgValue)
                const picker = document.createElement('ptc-gradients');
                picker.setAttribute('name', `${this.name}-bg-${i}`);
                picker.setAttribute('value', bgValue);
                picker.value = bgValue;
                picker.addEventListener('change', (e) => {
                    bg.value = e.detail.value;
                    const bgString = this.createBgString()
                    this._value = bgString
                    fireEvent(this, 'change', { value: bgString })
                })
                instanceContainer.appendChild(picker);
            } else if (bgType === 'color') {
                const picker = document.createElement('ptc-color-picker');
                picker.setAttribute('name', `${this.name}-bg-${i}`);
                // picker.setAttribute('value', bgValue);
                picker.value = bgValue;
                picker.addEventListener('change', (e) => {
                    bg.value = e.detail.value;
                    const bgString = this.createBgString()
                    this._value = bgString
                    fireEvent(this, 'change', { value: bgString })
                })
                instanceContainer.appendChild(picker);
            }

            this.bgsContainer.appendChild(instanceContainer);
        }


        this.createBgString = () => {
            let output = ``;
            this.bgData.forEach((bg, i) => {
                console.log(bg.value)
                output += bg.value;
                output += i < this.bgData.length - 1 ? ', ' : '';
            })
            console.log(output)
            return output;
        }

        this.addBackground = (type) => {
            if (type === 'image') {
                const bg = {
                    type: 'image',
                    value: `url(/assets/icon.png)`
                }
                this.bgData.unshift(bg);
                this.renderBgInstances();
                const bgString = this.createBgString()
                this._value = bgString
                fireEvent(this, 'change', { value: bgString })
            } else if (type === 'gradient') {
                const bg = {
                    type: 'gradient',
                    value: `linear-gradient(rgb(0, 0, 0) 1%, rgb(255, 255, 255) 99%)`
                }
                this.bgData.unshift(bg);
                this.renderBgInstances();
                const bgString = this.createBgString()
                this._value = bgString
                fireEvent(this, 'change', { value: bgString })
            } else if (type === 'color') {
                const bg = {
                    type: 'color',
                    value: `#ffffff`
                }
                this.bgData.push(bg);
                this.renderBgInstances();
                const bgString = this.createBgString()
                this._value = bgString
                fireEvent(this, 'change', { value: bgString })
            }
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

        const fillHeading = document.createElement('div');
        fillHeading.classList.add('heading');
        fillHeading.innerHTML = 'Fill';


        const bpo = document.createElement('ptc-overlay');
        bpo.setAttribute('width', '265px');
        bpo.setAttribute('height', '110px');
        const bpoButton = document.createElement('button');
        bpoButton.setAttribute('slot', 'target')
        bpoButton.classList.add('add-button');
        bpoButton.innerHTML = '<i class="fa-solid fa-plus"></i>';
        bpo.appendChild(bpoButton);

        const bpoOptions = document.createElement('div');
        bpoOptions.classList.add('bg-types');
        bpoOptions.setAttribute('slot', 'content');
        bpoOptions.innerHTML = `
    <button data-bg-type="image" class="bg-type bg-image">Image</button>
    <button data-bg-type="gradient" class="bg-type bg-gradient">Gradient</button>
    <button data-bg-type="color" class="bg-type bg-color">Color</button>
        `
        bpoOptions.addEventListener('click', (e) => {
            e.stopPropagation();
            const path = e.path || (e.composedPath && e.composedPath());
            const clicktElement = path[0];
            const bgType = clicktElement.dataset.bgType;
            if (bgType) {
                bpo.hideOverlay({ path: [] });
                this.addBackground(bgType);
            }

        });

        const bpoOptionColor = bpoOptions.querySelector('.bg-color');

        const checkColor = (e) => {
            const length = this.bgData.length;
            if (length > 0) {
                console.log(this.bgData);
                const hasColor = this.bgData[length - 1].type === 'color';
                if (hasColor) {
                    bpoOptionColor.classList.remove('active');
                    bpoOptionColor.setAttribute('disabled', 'true');
                } else {
                    bpoOptionColor.classList.add('active');
                    bpoOptionColor.removeAttribute('disabled');
                }
            }
        }

        bpo.addEventListener('ptcShow', checkColor)
        bpo.appendChild(bpoOptions);

        fillHeading.appendChild(bpo);


        this._shadow.appendChild(fillHeading);

        this.bgsContainer = document.createElement('div');
        this._shadow.appendChild(this.bgsContainer);

        const attrName = this.getAttribute('name');
        if (attrName) {
            this.name = attrName;
        }
    }
}