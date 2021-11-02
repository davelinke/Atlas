import SidebarPanel from './sidebar-panel.js';

class SidebarDocument extends SidebarPanel {

    constructor() {
        super()
        this.mainHeading = 'Document';
        this.pickLengthShow = function(pick){
            return pick.length === 0;
        };
        this.isDefaultPanel = true;

        console.log('document constructor')
    }

    async onInit() {
        console.log('document connectedCallback');
    }
}

export default SidebarDocument
