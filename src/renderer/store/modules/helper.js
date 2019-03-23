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

  activeHelper ({ commit }) {
    return new Promise((resolve) => {
      commit('ACTIVE_HELPER')
      resolve()
    })
  },
  inActiveHelper ({ commit }) {
    return new Promise((resolve) => {
      commit('INACTIVE_HELPER')
      setTimeout(() => {
        commit('CLEAR_SEARCH')
        resolve()
      }, 300)
    })
  },
  toggleHelperActive ({ state, dispatch }) {
    return new Promise((resolve) => {
      Promise.all([
        state.active
          ? dispatch('inActiveHelper')
          : dispatch('activeHelper')
      ]).then(resolve)
    })
  },

  /** search */

  changeSearchContent ({ commit }, { val }) {
    return new Promise((resolve, reject) => {
      if (typeof val === 'string') {
        commit('SET_SEARCH', val)
        resolve()
      } else {
        reject(new Error('@store/actions/changeSearchContent 值类型不是字符串'))
      }
    })
  }

}

export default {
  state,
  mutations,
  actions
}
