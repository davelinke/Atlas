import SidebarPanel from './sidebar-panel.js';

class SidebarDocument extends SidebarPanel {

    constructor() {
        super()
        this.mainHeading = 'Element';
        this.pickLengthShow = function(pick){
            return pick.length ===1;
        };
        this.isDefaultPanel = false;

        console.log('element constructor')
    }

    async onInit() {
        
    }
}

export default SidebarDocument
