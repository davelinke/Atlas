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
	display: grid;
	position: absolute;
	grid-template-columns: 0 auto 0;
	grid-template-rows: 0 auto 0;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
    margin: -1px;
}

.mod:hover {
    border: 1px solid var(--editor-element-border-hover-color, blue);
}

:host([active]) .mod{
	grid-template-columns: 5px auto 5px;
	grid-template-rows: 5px auto 5px;
    margin: -5px
}
:host(.picked) .mod{
    border: 1px solid var(--editor-element-border-picked-color, blue);
}

.mod__move {
	cursor: move;
}

.mod__resize--nw {
	cursor: nwse-resize;
}

.mod__resize--n {
	cursor: ns-resize;
}

.mod__resize--ne {
	cursor: nesw-resize;
}

.mod__resize--w {
	cursor: ew-resize;
}

.mod__resize--e {
	cursor: ew-resize;
}

.mod__resize--sw {
	cursor: nesw-resize;
}

.mod__resize--s {
	cursor: ns-resize;
}

.mod__resize--se {
	cursor: nwse-resize;
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

        this.modNW = document.createElement('div');
        this.modNW.classList.add('mod__resize--nw');
        this.modGrid.append(this.modNW);

        this.modN = document.createElement('div');
        this.modN.classList.add('mod__resize--n');
        this.modGrid.append(this.modN);

        this.modNE = document.createElement('div');
        this.modNE.classList.add('mod__resize--ne');
        this.modGrid.append(this.modNE);

        this.modW = document.createElement('div');
        this.modW.classList.add('mod__resize--w');
        this.modGrid.append(this.modW);

        this.modMove = document.createElement('div');
        this.modMove.classList.add('mod__move');
        this.modGrid.append(this.modMove);

        this.modE = document.createElement('div');
        this.modE.classList.add('mod__resize--e');
        this.modGrid.append(this.modE);

        this.modSW = document.createElement('div');
        this.modSW.classList.add('mod__resize--sw');
        this.modGrid.append(this.modSW);

        this.modS = document.createElement('div');
        this.modS.classList.add('mod__resize--s');
        this.modGrid.append(this.modS);

        this.modSE = document.createElement('div');
        this.modSE.classList.add('mod__resize--se');
        this.modGrid.append(this.modSE);

        this._shadow.append(this.modGrid);
    }

}

export default EditorElement;