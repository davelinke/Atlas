import SidebarPanel from './sidebar-panel.js'
import { fireEvent } from './lib-events.js'
import { LoadParticles } from "./lib-loader.js";

const Css = `
input[type=number],
input[type=color] {
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
}
.input-label{
    display: inline-flex;
    width: 1.5rem;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}
select{
  border: none;
  background-color: #efefef;
}
`

class SidebarDocument extends SidebarPanel {
  constructor() {
    super()
    this.mainHeading = 'Element'

    LoadParticles(['ptc-color-picker']);
    LoadParticles(['ptc-shadow-picker']);

    this.pickLengthShow = function (pick) {
      return pick.length === 1
    }

    this.isDefaultPanel = false

    this.shadowAppend = (elements) => {
      elements.forEach(element => {
        this._shadow.appendChild(element)
      })
    }


    this.disableInputs = () => {
      this.inputs.forEach(input => {
        input.setAttribute('disabled', 'disabled')
      })
    }

    this.enableInputs = () => {
      this.inputs.forEach(input => {
        input.removeAttribute('disabled')
      })
    }

    this.modifyLayoutInputs = (element) => {
      this.disableInputs()
      const wsDim = this.app.workspace.viewportDim
      const elementDims = element.getDimensions()
      const realLeft = elementDims.left
      const realTop = elementDims.top
      topInput.value = realTop - (wsDim / 2)
      leftInput.value = realLeft - (wsDim / 2)
      widthInput.value = (wsDim - elementDims.right) - realLeft
      heightInput.value = (wsDim - elementDims.bottom) - realTop
      colorInput.value = elementDims.backgroundColor
      borderWidthInput.value = elementDims.borderWidth
      borderStyleInput.value = elementDims.borderStyle

      borderColorInput.value = elementDims.borderColor
      opacityInput.value = elementDims.opacity ? elementDims.opacity : 1
      shadowInput.value = elementDims.boxShadow ? elementDims.boxShadow : null
    }

    this.onPickModStart = (e) => {
      const pick = e.detail
      if (pick.length > 0 && pick.length < 2) {
        this.disableInputs()
      }
    }

    this.onPickModEnd = (e) => {
      const pick = e.detail
      if (pick.length > 0 && pick.length < 2) {
        const element = pick[0]
        this.modifyLayoutInputs(element)
        this.enableInputs()
      }
    }

    this.onPickChange = function (e) {
      const pick = e.detail
      this.pick = pick
      if (pick.length > 0 && pick.length < 2) {
        const element = pick[0]
        this.modifyLayoutInputs(element)
      }
    }

    this.modifyElement = (e) => {
      const input = e.target
      const dimension = input.name
      const wsDim = this.app.workspace.viewportDim

      const element = this.pick[0]

      const elementDims = element.getDimensions()

      const currentDims = {
        left: elementDims.left,
        top: elementDims.top,
        bottom: elementDims.bottom,
        right: elementDims.right
      }

      const resizePickArea = () => {
        fireEvent(this, 'resizePickArea', null)
      }

      switch (dimension) {
        case 'top': {
          const currentHeight = ((wsDim - currentDims.bottom) - currentDims.top)
          const newTop = ((wsDim / 2) + parseInt(input.value))
          element.setProp('top', newTop)
          element.setProp('bottom', wsDim - (newTop + currentHeight))
          resizePickArea()
          break
        }
        case 'left': {
          const currentWidth = ((wsDim - currentDims.right) - currentDims.left)
          const newLeft = ((wsDim / 2) + parseInt(input.value))
          element.setProp('left', newLeft)
          element.setProp('right', wsDim - (newLeft + currentWidth))
          resizePickArea()
          break
        }
        case 'width': {
          element.setProp('right', wsDim - (currentDims.left + parseInt(input.value)))
          resizePickArea()
          break
        }
        case 'height': {
          element.setProp('bottom', wsDim - (currentDims.top + parseInt(input.value)))
          resizePickArea()
          break
        }
        default: {
          const value = input.value ? input.value : (e.detail ? e.detail.value : null);
          console.log(dimension, value)
          element.setProp(dimension, value)
          fireEvent(this, 'storeDocument', null)
        }
      }
    }

    // STRUCTURE

    const styles = document.createElement('style')
    styles.innerHTML = Css
    this.shadowAppend([styles])

    const topInput = this.createInput({
      input: {
        name: 'top',
        type: 'number'
      },
      label: {
        initial: 'T',
      }
    })

    const leftInput = this.createInput(
      {
        input: {
          name: 'left',
          type: 'number'
        },
        label: {
          initial: 'L',
        }
      }
    )

    const widthInput = this.createInput({
      input: {
        name: 'width',
        type: 'number'
      },
      label: {
        initial: 'W',
      }
    })

    const heightInput = this.createInput({
      input: {
        name: 'height',
        type: 'number'
      },
      label: {
        initial: 'H',
      }
    })

    this.addSeparator();

    this.addHeading('Opacity');

    const opacityInput = this.createInput({
      //'opacity', 'BG', 'fa-regular fa-eye' ,'range'
      wrap: {
        class: 'span-2'
      },
      input: {
        name: 'opacity',
        type: 'range',
        min: 0,
        max: 1,
        step: 0.01,
        initial: 1
      },
      label: {
        initial: 'O',
        icon: 'fa-regular fa-eye'
      }
    })

    this.addSeparator();

    this.addHeading('Fill');

    const colorInput = document.createElement('ptc-color-picker');
    colorInput.setAttribute('name', 'backgroundColor');
    colorInput.classList.add('span-2')
    colorInput.setAttribute('initial', 'C')
    this.grid.appendChild(colorInput)

    this.addSeparator();

    this.addHeading('Border');

    const borderColorInput = document.createElement('ptc-color-picker');
    borderColorInput.setAttribute('name', 'borderColor');
    borderColorInput.setAttribute('initial', 'C');
    borderColorInput.classList.add('span-2')
    this.grid.appendChild(borderColorInput)

    const borderWidthInput = this.createInput({
      input: {
        name: 'borderWidth',
        type: 'number',
        min: 0,
      },
      label: {
        initial: 'W',
      }
    });

    const borderStyleInput = document.createElement('select');
    borderStyleInput.setAttribute('name', 'borderStyle');
    borderStyleInput.addEventListener('change', (e) => {
      this.modifyElement(e);
    })
    const borderOptions = ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'];
    borderOptions.forEach(option => {
      const optionEl = document.createElement('option');
      optionEl.value = option;
      optionEl.innerText = option;
      borderStyleInput.appendChild(optionEl);
    });


    this.grid.appendChild(borderStyleInput);

    this.addSeparator();

    const shadowHeading = this.addHeading('Shadows', true);
    shadowHeading.addEventListener('click', () => {
      const element = this.pick[0]
      const elementDims = element.getDimensions()
      const currentShadow = elementDims.boxShadow;
      const newShadow = (currentShadow ? currentShadow + ', ' : '') + `0px 2px 3px 0 rgba(0,0,0, 0.25)`
      element.setProp('boxShadow', newShadow)
      fireEvent(this, 'storeDocument', null)
      this.modifyLayoutInputs(element)
    })

    const shadowInput = document.createElement('ptc-shadow-picker');
    shadowInput.setAttribute('name', 'boxShadow');
    shadowInput.classList.add('span-2')
    this.grid.appendChild(shadowInput)

    this.inputs = [topInput, leftInput, heightInput, widthInput, colorInput, borderColorInput, opacityInput, borderWidthInput, shadowInput]

    this.inputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        fireEvent(this, 'toggleKeyboardShortcuts', false)
      })

      input.addEventListener('change', this.modifyElement)
      input.addEventListener('input', this.modifyElement)

      input.addEventListener('blur', (e) => {
        fireEvent(this, 'toggleKeyboardShortcuts', true)
      })
    })
  }

  async onInit() {

  }
}

export default SidebarDocument
