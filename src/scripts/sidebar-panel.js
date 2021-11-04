import { fireEvent } from './lib-events.js'

const Css = `
:host{
    display: block;
    padding: 1rem;
    font-family: inherit;
}
:host(.hidden){
    position: absolute;
    opacity: 0;
    pointer-events: none;
}
h3{
    font-family: inherit;
    font-weight: 500;
    margin: 0 0 1rem 0;
    text-transform: uppercase;
    font-size: 0.875rem;
}
`;
class SidebarPanel extends HTMLElement {

    constructor() {
        super()

        //STATE
        this.app = null;

        this.pickLengthShow = 0;

        this.mainHeading = null;

        // METHODS

        this.pickChange = (e)=>{
            this.showHide(e);
            this.onPickChange && this.onPickChange(e);
        }

        this.pickModEnd = (e)=>{
            this.onPickModEnd && this.onPickModEnd(e);
        }

        this.pickModStart = (e)=>{
            this.onPickModStart&& this.onPickModStart(e);
        }

        this.showHide = (e)=>{
            const pick = e.detail;
            if (this.pickLengthShow(pick)) {
                this.classList.remove('hidden');
            } else {
                this.classList.add('hidden');
            }
        }

        this.onHandShake = (app)=>{
            this.app = app;

            this.app.addEventListener('pickChange', this.pickChange);
    
            this.app.addEventListener('canvasModEnd', this.pickModEnd);
    
            this.app.addEventListener('canvasModStart', this.pickModStart);
        }

        // STRUCTURE
        this._shadow = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('style')
        styles.innerHTML = Css
        this._shadow.appendChild(styles)

        this.mainHeadingElement = document.createElement('h3');
        this._shadow.appendChild(this.mainHeadingElement);
    }

    async connectedCallback() {

        !this.isDefaultPanel && this.classList.add('hidden')

        this.mainHeading && (this.mainHeadingElement.innerHTML = this.mainHeading);

        fireEvent(this,'handShake',this);
    }
}

export default SidebarPanel
