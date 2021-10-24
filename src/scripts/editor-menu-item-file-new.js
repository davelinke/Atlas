import EditorMenuItem from "./editor-menu-item.js";
// import { LoadParticles } from "./tools-loader.js";

class EditorMenuItemFileNew extends EditorMenuItem {

    /**
     * the button constructor
     */
    constructor() {
        super();
        this._button.innerHTML = this.echo("New");
        this._button.addEventListener("click", ()=>{
            //this._modal.open = true;
        });

        // LOAD DEPENDENCIES
        // LoadParticles(['ptc-modal']);

        // the modal
        // this._modal = document.createElement("ptc-modal");
        // this._modal.setAttribute("id", "editor-menu-item-file-new-modal");
        // this._modal.innerHTML = `
        // <header style="padding:1rem 1rem 0 1rem">
        // <h2 style="margin-top:0">${this.echo("New")}</h2>
        // </header>
        // <main style="padding:0 1rem">
        //     <input type="number" placeholder="${this.echo("Width")}" id="newProject" style="width:100%;margin-bottom:1rem">
        // </main>
        // <footer style="padding:0 1rem 1rem">
        //     <button class="button button--primary">${this.echo("Create")}</button>
        //     <button class="button button--secondary">${this.echo("Cancel")}</button>
        // </footer>
        // `;
        // this._shadow.appendChild(this._modal);
    }

}

export default EditorMenuItemFileNew;