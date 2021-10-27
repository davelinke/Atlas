const Css = `
input{
    margin: 4px;
    border: 1px solid var(--input-border-color, #ccc);
    border-radius: 3px;
    height: 41px;
    box-sizing: border-box;
    background-color: #fff;
    font-size: 1rem;
    line-height: 1rem;
    padding: 0 0 0 8px;
}
`;

class SettingZoom extends HTMLElement {

    constructor() {
        super();
        

        // attach shadow dom
        this._shadow = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('style');
        styles.innerHTML = Css;
        this._shadow.appendChild(styles);

        const zoomInput = document.createElement('input');
        zoomInput.setAttribute('type', 'number');
        zoomInput.setAttribute('min', '5');
        zoomInput.setAttribute('max', '5000');
        zoomInput.setAttribute('step', '5');
        zoomInput.setAttribute('value', '100');

        zoomInput.addEventListener('change', (e) => {
            const zoom = e.target.value / 100;
            this.dispatchEvent(new CustomEvent('setZoom', { detail: zoom, bubbles: true, composed: true }));
        });

        this._shadow.appendChild(zoomInput);
        
    }


}

export default SettingZoom;