import log from '../utils/statusBarControl'

const state = {
  active: false,
  search: ''
}

const mutations = {

  /** active */

  ACTIVE_HELPER (state) {
    state.active = true
  },
  INACTIVE_HELPER (state) {
    state.active = false
  },

  /** search */

  CLEAR_SEARCH (state) {
    state.search = ''
  },
  SET_SEARCH (state, value) {
    state.search = value
  }

}

const actions = {

  /** active */

  @log.flush('激活搜索')
  activeHelper ({ commit }) {
    commit('ACTIVE_HELPER')
  },
  @log.flush('关闭搜索')
  deActiveHelper ({ commit }) {
    commit('INACTIVE_HELPER')
    setTimeout(() => {
      commit('CLEAR_SEARCH')
    }, 300)
  },
  toggleHelperActive ({ state, dispatch }) {
    state.active
      ? dispatch('deActiveHelper')
      : dispatch('activeHelper')
  },

  /** search */

  changeSearchContent ({ commit }, { val }) {
    if (typeof val === 'string') {
      commit('SET_SEARCH', val)
    }
  }

}

export default {
  state,
  mutations,
  actions
}
