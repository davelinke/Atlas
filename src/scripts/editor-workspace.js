import { GenerateId, CamelCaseToDashed } from "./lib-strings.js";

const viewportDim = 10000;

const propUnitsJs = {
    'backgroundPosition':'px',
    'backgroundPositionX':'px',
    'backgroundPositionY':'px',
    'border':'px',
    'borderBottom':'px',
    'borderBottomWidth':'px',
    'borderLeft':'px',
    'borderLeftWidth':'px',
    'borderRadius':'px',
    'borderRight':'px',
    'borderRightWidth':'px',
    'borderSpacing':'px',
    'borderTop':'px',
    'borderTopWidth':'px',
    'borderWidth':'px',
    'bottom':'px',
    'fontSize':'px',
    'fontSizeAdjust':'px',
    'height':'px',
    'left':'px',
    'letterSpacing':'px',
    'lineHeight':'px',
    'margin':'px',
    'marginBottom':'px',
    'marginLeft':'px',
    'marginRight':'px',
    'marginTop':'px',
    'maxHeight':'px',
    'maxWidth':'px',
    'minHeight':'px',
    'minWidth':'px',
    'outline':'px',
    'outlineWidth':'px',
    'padding':'px',
    'paddingBottom':'px',
    'paddingLeft':'px',
    'paddingRight':'px',
    'paddingTop':'px',
    'right':'px',
    'top':'px',
    'width':'px',
    'wordSpacing':'px',
    'transitionDuration':'ms',
    'transitionDelay':'ms'
};

const GenerateSytle = (styles, elementId) => {
    let style = `#${elementId} {`;
    for (let key in styles) {
        const cssProp = CamelCaseToDashed(key);
        const cssValue = styles[key];
        const unit = propUnitsJs[key]?propUnitsJs[key]:'';
        style += `${cssProp}:${cssValue}${unit};`;
    }
    style += '}';
    return style;
}

const Css = `
:host{
    display:block;
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    overflow:hidden;
}

.wrapper{
    width: 100%; 
    height: 100%; 
    overflow: auto;
}

.workspace{
    width:${viewportDim}px;
    height:${viewportDim}px;
    background-color: var(--workspace-bckground-color, #f9f9f9);
    position:relative;
}
`;

class EditorWorkspace extends HTMLElement {

    /**
     * the button constructor
     */
    constructor() {
        super();

        // STATE

        this._zoomScale = 1;

        // PROPS
        Object.defineProperty(this, 'zoomScale', {
            get: () => {
                return this._zoomScale;
            },
            set: (val) => {
                if (val !== this._zoomScale) {
                    this._zoomScale = val;
                    this._workspace.style.transform = `scale(${val})`;
                }
            }
        });

        // EVENT LISTENERS

        // listen for model changes and update local state
        const app = this.closest('editor-app');
        app && app.addEventListener('modelChange', (e) => {
            console.log('model-change')
            this.zoomScale = e.detail.zoomScale;
        });


        // METHODS
        
        this.mouseCoords = (e, scale) => {
            const rect = this._workspace.getBoundingClientRect();

            const x = e.clientX - rect.left; //x position within the element.
            const y = e.clientY - rect.top;  //y position within the element.

            const filteredCoords = this.coordsFilterFn(x, y, false);

            const returnValue = {
                x: (filteredCoords.x / scale) - (viewportDim / 2),
                y: (filteredCoords.y / scale) - (viewportDim / 2)
            }

            return returnValue;
        }

        this.coordsFilterFn = (x, y) => { return { x: x, y: y } };

        this.startInput = (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.button === 0) {
                const downEvent = e;
                const scale = this.zoomScale;
                const eventDetail = this.mouseCoords(downEvent, scale);

                // fire start event listener

                this.dispatchEvent(
                    new CustomEvent(
                        'workspaceInputStart',
                        {
                            detail: {
                                mouseEvent: e,
                                coords: eventDetail
                            },
                            bubbles: true,
                            composed: true
                        }
                    )
                );

                const stopInput = () => {
                    // fire end event listener
                    this.dispatchEvent(
                        new CustomEvent(
                            'workspaceInputEnd',
                            {
                                bubbles: true,
                                composed: true
                            }
                        )
                    );

                    document.removeEventListener('mouseup', stopInput);
                    document.removeEventListener('touchend', stopInput);
                    document.removeEventListener('mousemove', move);
                    document.removeEventListener('touchmove', move);
                }


                const move = (e) => {
                    const delta = {
                        x: e['x'] - downEvent['x'],
                        y: e['y'] - downEvent['y']
                    }
                    const filteredDelta = this.coordsFilterFn(delta.x, delta.y, true);
                    const deltaX = filteredDelta.x / scale;
                    const deltaY = filteredDelta.y / scale;

                    const eventDetail = {
                        x: e.x,
                        y: e.y,
                        deltaX,
                        deltaY
                    }

                    console.log(eventDetail)

                    // fire move event listener



                    this.dispatchEvent(
                        new CustomEvent(
                            'workspaceInputMove',
                            {
                                detail: eventDetail,
                                bubbles: true,
                                composed: true
                            }
                        )
                    );
                }

                document.addEventListener('mouseup', stopInput);
                document.addEventListener('touchend', stopInput);
                document.addEventListener('mousemove', move);
                document.addEventListener('touchmove', move);

            }

        }

        this.addElement = (props={})=>{
            const args = {...{
                left: 5000,
                top: 5000,
                width: 100,
                height: 100,
                backgroundColor: '#fff',
                borderColor: '#000',
                borderWidth: 1,
                borderRadius: 0,
                borderStyle: 'solid',
                zIndex: 1,
                position: 'absolute'
            }, ...props};
            const element = document.createElement('div');
            
            const elementId = GenerateId();

            element.setAttribute('id', elementId);

            const elementStyle = document.createElement('style');
            elementStyle.innerHTML = GenerateSytle(args, elementId);
            element.appendChild(elementStyle);
            this._workspace.appendChild(element);

            return element;
        }

        // STRUCTURE
        
        this._shadow = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('style');
        styles.innerHTML = Css;
        this._shadow.appendChild(styles);

        this._wrapper = document.createElement('div');
        this._wrapper.classList.add('wrapper');
        this._shadow.append(this._wrapper);

        this._workspace = document.createElement('div');
        this._workspace.classList.add('workspace');
        this._workspace.style.transform = `scale(${this.zoomScale})`;
        //this._workspace.innerHTML = '<div style="position:absolute; background:#fff; border:1px solid #000; top:4750px; left:4840px; width:300px; height:500px"></div>'

        this._workspace.addEventListener('mousedown', this.startInput);
        this._workspace.addEventListener('touchstart', this.startInput);

        this._wrapper.append(this._workspace);
    }


    // LIFE CYCLE

    connectedCallback() {
        // scroll to middle if it's not defined
        this._wrapper.scrollLeft = ((viewportDim / 2) - (this.getBoundingClientRect().width / 2));
        this._wrapper.scrollTop = ((viewportDim / 2) - (this.getBoundingClientRect().height / 2));

        // fire up an event to make myself available to the app
        this.dispatchEvent(new CustomEvent('editorWorkspaceReady', { detail: this, bubbles: true, composed: true }));
    }

}

export default EditorWorkspace;