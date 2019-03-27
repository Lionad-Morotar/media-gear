const getters = {

  /** helper component */

  helperActive: state => state.helper.active,
  helperSearchContent: state => state.helper.search,

  /** status-bar component */

  statusBarAutoHide: state => state.statusBar.autoHide,
  statusBarContent: state => state.statusBar.content

}

export default getters
