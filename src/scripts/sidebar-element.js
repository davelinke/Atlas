import SidebarPanel from './sidebar-panel.js';
import { createNumInput } from './lib-utils.js';
import { fireEvent } from './lib-events.js'

const Css = `
input[type=number] {
    width: 50px;
    border: none;
    background-color: #efefef;
    border-radius: 3px;
    font-family: inherit;
    font-size: 12px;
    padding: 0.25rem;
}
input[type=number][disabled]{
    opacity: 0.5;
}
.input-wrap{
    display: inline-flex;
    margin-inline-end: 1rem;
    margin-block-end: 0.5rem;
}
.input-label{
    display: inline-flex;
    width: 1.5rem;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}
`;

class SidebarDocument extends SidebarPanel {

    constructor() {
        super()
        this.mainHeading = 'Element';
        this.pickLengthShow = function (pick) {
            return pick.length === 1;
        };
        this.isDefaultPanel = false;

        this.createInput = (name, initial, icon = null) => {
            const wrap = document.createElement('div');
            wrap.classList.add('input-wrap');
            wrap.setAttribute('title', name);
            const label = document.createElement('label');
            label.classList.add('input-label');
            label.setAttribute('for', name);
            label.innerHTML = icon ? icon : initial;
            const input = createNumInput(name);
        
            wrap.appendChild(label);
            wrap.appendChild(input);

            this._shadow.appendChild(wrap);
        
            return input;
        }

        const topInput = this.createInput('top','T');

        const leftInput = this.createInput('left', 'L');

        const widthInput = this.createInput('width', 'W');

        const heightInput = this.createInput('height', 'H');

        this.shadowAppend = (elements) => {
            elements.forEach(element => {
                this._shadow.appendChild(element);
            })
        }

        const styles = document.createElement('style')
        styles.innerHTML = Css
        this.shadowAppend([styles])

        this.inputs = [topInput, leftInput, heightInput, widthInput];

        this.modifyElement = (e) => {
            const input = e.target;
            const dimension = input.name;
            const wsDim = this.app.workspace.viewportDim;

            const element = this.pick[0];

            const elementDims = element.getDimensions()

            const currentDims = {
                left: elementDims.left,
                top: elementDims.top,
                bottom: elementDims.bottom,
                right: elementDims.right
            }

            const resizePickArea = () => {
                fireEvent(this, 'resizePickArea', null);
            }

            switch (dimension) {
                case 'top':
                    const currentHeight = ((wsDim - currentDims.bottom) - currentDims.top);
                    const newTop = ((wsDim / 2) + parseInt(input.value))
                    element.setProp('top', newTop)
                    element.setProp('bottom',wsDim - (newTop + currentHeight))
                    resizePickArea()
                    break;
                case 'left':
                    const currentWidth = ((wsDim - currentDims.right) - currentDims.left);
                    const newLeft = ((wsDim / 2) + parseInt(input.value))
                    element.setProp('left', newLeft)
                    element.setProp('right',wsDim - (newLeft + currentWidth))
                    resizePickArea()
                    break;
                case 'width':
                    element.setProp('right', wsDim - (currentDims.left + parseInt(input.value)))
                    resizePickArea()
                    break;
                case 'height':
                    element.setProp('bottom', wsDim - (currentDims.top + parseInt(input.value)))
                    resizePickArea()
                    break;
            }
        }

        this.inputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                fireEvent(this, 'toggleKeyboardShortcuts', false)
            })

            input.addEventListener('change', this.modifyElement)

            input.addEventListener('blur', (e) => {
                fireEvent(this, 'toggleKeyboardShortcuts', true)
            })
        })

        //this.shadowAppend(this.inputs);

        this.disableInputs = () => {
            this.inputs.forEach(input => {
                input.setAttribute('disabled', 'disabled');
            })
        }

        this.enableInputs = () => {
            this.inputs.forEach(input => {
                input.removeAttribute('disabled');
            })
        }

        this.modifyLayoutInputs = (element) => {

            this.disableInputs();

            const wsDim = this.app.workspace.viewportDim;
            const elementDims = element.getDimensions()
            const realLeft = elementDims.left
            const realTop = elementDims.top
            topInput.value = realTop - (wsDim / 2)
            leftInput.value = realLeft - (wsDim / 2)
            widthInput.value = (wsDim - elementDims.right) - realLeft
            heightInput.value = (wsDim - elementDims.bottom) - realTop
        }

        this.onPickModStart = (e) => {
            const pick = e.detail;
            if (pick.length > 0 && pick.length < 2) {
                this.disableInputs();
            }
        }

        this.onPickModEnd = (e) => {
            const pick = e.detail;
            if (pick.length > 0 && pick.length < 2) {
                const element = pick[0];
                this.modifyLayoutInputs(element);
                this.enableInputs();
            }
        }

        this.onPickChange = function (e) {
            const pick = e.detail;
            this.pick = pick;
            if (pick.length > 0 && pick.length < 2) {
                const element = pick[0];
                this.modifyLayoutInputs(element);
            }
        }
    }

    async onInit() {

    }
}

export default SidebarDocument
