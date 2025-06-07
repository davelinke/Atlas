import EditorMenuItem from './editor-menu-item.js'
import { fireEvent } from './lib-events.js'

export default class EditorMenuItemObjectUngroup extends EditorMenuItem {
    constructor() {
        super()

        this.app = null
        this.pick = []

        this._button.innerText = 'Ungroup'
        this._button.title = 'Ungroup selected group (Ctrl+Shift+G)'

        this.addEventListener('editorMenuItemClick', () => {
            this.ungroupElements()
        })

        this.onHandShake = (app) => {
            this.app = app
            this.app.addEventListener('pickChange', this.setPick)
            app.registerKeyDownShortcut({
                key: 'g',
                action: (e) => {
                    if (e.ctrlKey && e.shiftKey) {
                        this.ungroupElements()
                    }
                }
            })
        }
    }

    setPick = (e) => {
        this.pick = e.detail
    }

    ungroupElements() {
        if (!this.app) {
            console.error('App not initialized yet')
            return
        }

        if (!this.pick || this.pick.length !== 1) {
            console.log('Select a single group to ungroup')
            return
        }

        const group = this.pick[0]
        const type = (group.getAttribute('type') || '').toLowerCase()
        if (type !== 'group') {
            console.warn('Selected element is not a group')
            return
        }

        const workspace = this.app.workspace
        const viewportDim = workspace.viewportDim
        const groupDims = group.getDimensions()
        const groupWidth = viewportDim - (groupDims.left + groupDims.right)
        const groupHeight = viewportDim - (groupDims.top + groupDims.bottom)
        const elements = Array.from(group.children)
        let ungrouped = []

        elements.forEach(element => {
            const elementDims = element.getDimensions()

            // Restore absolute position and size
            const absoluteLeft = groupDims.left + elementDims.left
            const absoluteTop = groupDims.top + elementDims.top
            const absoluteRight = viewportDim - (absoluteLeft + (groupWidth - (elementDims.left + elementDims.right)))
            const absoluteBottom = viewportDim - (absoluteTop + (groupHeight - (elementDims.top + elementDims.bottom)))

            element.setProp('left', absoluteLeft)
            element.setProp('top', absoluteTop)
            element.setProp('right', absoluteRight)
            element.setProp('bottom', absoluteBottom)
            element.setProp('pointerEvents', '')

            group.removeChild(element)
            workspace._canvas.appendChild(element)
            ungrouped.push(element)

            // Notify inspector that this element was "added"
            fireEvent(this.app, 'editorElementAdded', element)
        })

        // Remove the group container from its parent, wherever it is
        if (group.parentNode) {
            group.parentNode.removeChild(group)
            // Notify inspector that this group was "removed"
            fireEvent(this.app, 'editorElementRemoved', group)
        }

        // Update selection to the ungrouped elements
        this.pick = ungrouped
        fireEvent(this, 'pickChange', ungrouped)

        // Store document state
        fireEvent(this, 'storeDocument', null)
    }

    connectedCallback() {
        fireEvent(this, 'handShake', this)
    }
}