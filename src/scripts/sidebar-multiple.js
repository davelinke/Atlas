import SidebarPanel from './sidebar-panel.js'

class SidebarDocument extends SidebarPanel {
  constructor () {
    super()
    this.mainHeading = 'Multiple Elements'
    this.pickLengthShow = function (pick) {
      return pick.length > 1
    }
    this.isDefaultPanel = false
  }

  async onInit () {

  }
}

export default SidebarDocument
