import EditorMenuItem from './editor-menu-item.js'
import { fireEvent } from './lib-events.js'

export default class EditorMenuItemObjectUngroup extends EditorMenuItem {
    constructor() {
        super()
        
        this._button.innerText = 'Ungroup'
        this._button.title = 'Ungroup selected elements (Ctrl+Shift+G)'
        
        this.addEventListener('editorMenuItemClick', () => {
            this.ungroupElements()
        })
        
        // Register keyboard shortcut
        this.onHandShake = (app) => {
            this.app = app
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
    
    ungroupElements() {
        const workspace = this.app.workspace
        const pick = workspace.querySelector('tool-select').pick
        
        pick.forEach(group => {
            const elements = Array.from(group.children)
            if (elements.length === 0) return
            
            const groupDims = group.getDimensions()
            
            elements.forEach(element => {
                const elementDims = element.getDimensions()
                
                // Calculate absolute position
                const absoluteLeft = groupDims.left + elementDims.left
                const absoluteTop = groupDims.top + elementDims.top
                
                // Update element position to absolute coordinates
                element.setProp('left', absoluteLeft)
                element.setProp('top', absoluteTop)
                
                // Move element to workspace
                group.removeChild(element)
                workspace._canvas.appendChild(element)
            })
            
            // Remove empty group
            workspace._canvas.removeChild(group)
        })
        
        // Clear selection
        workspace.querySelector('tool-select').deselectAll()
        
        // Store document state
        fireEvent(this, 'storeDocument', null)
    }
}