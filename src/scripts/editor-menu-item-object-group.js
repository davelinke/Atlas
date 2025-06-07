import EditorMenuItem from './editor-menu-item.js'
import { fireEvent } from './lib-events.js'

export default class EditorMenuItemObjectGroup extends EditorMenuItem {
    constructor() {
        super()

        this.app = null // will be set on handshake
        this.pick = [] // will be set on pickChange

        this._button.innerText = 'Group'
        this._button.title = 'Group selected elements (Ctrl+G)'

        this.addEventListener('editorMenuItemClick', () => {
            this.groupElements()
        })

        // Register keyboard shortcut
        this.onHandShake = (app) => {
            console.log('onHandShake', app)
            this.app = app

            // Listen for pickChange event
            this.app.addEventListener('pickChange', this.setPick)

            app.registerKeyDownShortcut({
                key: 'g',
                action: (e) => {
                    if (e.ctrlKey) {
                        this.groupElements()
                    }
                }
            })
        }
    }

    setPick = (e) => {
        this.pick = e.detail
    }

    groupElements() {
        if (!this.app) {
            console.error('App not initialized yet')
            return
        }
        
        if (!this.pick || this.pick.length < 2) {
            console.log('Need at least 2 elements to group')
            return
        }
        
        console.log('Grouping elements:', this.pick.map(el => el.id))
        
        const workspace = this.app.workspace
        const viewportDim = workspace.viewportDim
        
        // Create group container
        const groupContainer = workspace.addElement('group', {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 0,
            position: 'absolute'
        })
        
        // Calculate group bounds
        const bounds = this.calculateGroupBounds(this.pick)
        console.log('Calculated group bounds:', bounds)
        
        // Set group container dimensions
        groupContainer.setProp('left', bounds.left)
        groupContainer.setProp('top', bounds.top)
        groupContainer.setProp('right', bounds.right)
        groupContainer.setProp('bottom', bounds.bottom)
        
        // Calculate group container's dimensions
        const groupWidth = viewportDim - (bounds.left + bounds.right)
        const groupHeight = viewportDim - (bounds.top + bounds.bottom)
        
        // Move elements into group
        this.pick.forEach(element => {
            console.log(element)
            const elementDims = element.getDimensions()
            
            // Calculate relative position within group
            const relativeLeft = elementDims.left - bounds.left
            const relativeTop = elementDims.top - bounds.top
            
            // Calculate right and bottom relative to the group container
            const relativeRight = groupWidth - (relativeLeft + (viewportDim - (elementDims.left + elementDims.right)))
            const relativeBottom = groupHeight - (relativeTop + (viewportDim - (elementDims.top + elementDims.bottom)))
            
            console.log(`Moving element ${element.id} to relative position:`, {
                left: relativeLeft,
                top: relativeTop,
                right: relativeRight,
                bottom: relativeBottom
            })
            
            // Update element position relative to group
            element.setProp('left', relativeLeft)
            element.setProp('top', relativeTop)
            element.setProp('right', relativeRight)
            element.setProp('bottom', relativeBottom)
            // make element unreachable to selection
            element.setProp('pointerEvents', 'none')
            
            // Move element to group container
            //workspace._canvas.removeChild(element)
            this.app.workspace.removeElement(element)
            groupContainer.appendChild(element)
        })
        
        // Clear selection
        this.pick = [groupContainer];
        fireEvent(this, 'pickChange', this.pick)
        
        // Select the new group
        //this.app.querySelector('tool-select').pickRegister(groupContainer)
        
        // Store document state
        fireEvent(this, 'storeDocument', null)
    }

    calculateGroupBounds(elements) {
        const viewportDim = this.app.workspace.viewportDim
        let minLeft = viewportDim
        let minTop = viewportDim
        let maxRight = 0
        let maxBottom = 0

        elements.forEach(element => {
            const dims = element.getDimensions()
            minLeft = Math.min(minLeft, dims.left)
            minTop = Math.min(minTop, dims.top)
            maxRight = Math.max(maxRight, viewportDim - dims.right)
            maxBottom = Math.max(maxBottom, viewportDim - dims.bottom)
        })

        return {
            left: minLeft,
            top: minTop,
            right: viewportDim - maxRight,
            bottom: viewportDim - maxBottom
        }
    }

    connectedCallback() {
        console.log('Connected callback called, dispatching handShake event')
        fireEvent(this, 'handShake', this)
    }
} 