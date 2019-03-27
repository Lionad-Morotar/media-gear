const state = {
  autoHide: false,
  content: '',
  history: []
}

const mutations = {

  /** autoHide */

  ACTIVE_STATUS_BAR_AUTO_HIDE (state) {
    state.autoHide = true
  },
  DEACTIVE_STATUS_BAR_AUTO_HIDE (state) {
    state.autoHide = false
  },

  /** content & history */

  SET_STATUS_BAR_CONTENT (state, val) {
    state.history.push(val)
    state.content = val
  }

}

const actions = {

  /** autoHide */

  activeStatusBarAutoHide ({ commit }) {
    return new Promise((resolve) => {
      commit('ACTIVE_STATUS_BAR_AUTO_HIDE')
      resolve()
    })
  },
  deactiveStatusBarAutoHide ({ commit }) {
    return new Promise((resolve) => {
      commit('DEACTIVE_STATUS_BAR_AUTO_HIDE')
      resolve()
    })
  },
  toggleHelperActive ({ state, dispatch }) {
    return new Promise((resolve) => {
      Promise.all([
        state.active
          ? dispatch('deactiveStatusBarAutoHide')
          : dispatch('activeStatusBarAutoHide')
      ]).then(resolve)
    })
  },

  /** content & history */

  changeStatusBarContent ({ commit }, payload) {
    return new Promise((resolve) => {
      const { content } = payload
      typeof content === 'string' && (
        commit('SET_STATUS_BAR_CONTENT', content)
      )
      resolve()
    })
  }

}

export default {
  state,
  mutations,
  actions
}
