const getters = {

  /** os */

  windows: state => state.madros.windows,
  activeWindow: state => state.madros.activeWindow,

  /** helper component */

  helperActive: state => state.helper.active,
  helperSearchContent: state => state.helper.search,

  /** status-bar component */

  statusBarAutoHide: state => state.statusBar.autoHide,
  statusBarContent: state => state.statusBar.content

}

export default getters
