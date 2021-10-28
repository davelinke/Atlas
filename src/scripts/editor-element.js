const Css = `
:host {
	user-select: none;
	box-sizing: border-box;
}

:host(.active) .mod__resize--n, :host(.active) .mod__resize--w, :host(.active) .mod__resize--e, :host(.active) .mod__resize--s {
	background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, var(--color-selected) 5px, var(--color-selected) 5px);
}

:host(.active) .mod__resize--nw, :host(.active) .mod__resize--ne, :host(.active) .mod__resize--sw, :host(.active) .mod__resize--se {
	background-color: var(--color-selected);
}

:host(:hover) .mod__resize--n, :host(:hover) .mod__resize--w, :host(:hover) .mod__resize--e, :host(:hover) .mod__resize--s,
:host(.active:hover) .mod__resize--n,
:host(.active:hover) .mod__resize--w,
:host(.active:hover) .mod__resize--e,
:host(.active:hover) .mod__resize--s {
	background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, var(--color-active) 5px, var(--color-active) 5px);
}

:host(:hover) .mod__resize--nw, :host(:hover) .mod__resize--ne, :host(:hover) .mod__resize--sw, :host(:hover) .mod__resize--se,
:host(.active:hover) .mod__resize--nw,
:host(.active:hover) .mod__resize--ne,
:host(.active:hover) .mod__resize--sw,
:host(.active:hover) .mod__resize--se {
	background-color: var(--color-active);
}

.mod {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
    margin: -1px;
}

.mod:hover {
    border: 1px solid var(--editor-element-border-hover-color, blue);
}

:host(.picked) .mod{
    border: 1px solid var(--editor-element-border-picked-color, blue);
}

`;

class EditorElement extends HTMLElement {

    /**
     * the button constructor
     */
    constructor() {
        super();

        // STATE

        this._picked = false;

        //PROPS
        Object.defineProperty(this, 'picked', {
            get: () => {
                return this._picked;
            },
            set: (val) => {
                this._picked = val ? true : false;
                const classListFn = this._picked ? 'add' : 'remove';
                this.classList[classListFn]('picked');
            }
        });

        // attach shadow dom
        this._shadow = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('style');
        styles.innerHTML = Css;
        this._shadow.appendChild(styles);

        // create the html
        const slot = document.createElement('slot');
        this._shadow.append(slot);

        this.modGrid = document.createElement('div');
        this.modGrid.classList.add('mod');

        this._shadow.append(this.modGrid);
    }

}

export default EditorElement;