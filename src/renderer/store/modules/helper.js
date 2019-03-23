const state = {
  active: false
}

const mutations = {

  /** active */

  ACTIVE_HELPER (state) {
    state.active = true
  },
  INACTIVE_HELPER (state) {
    state.active = false
  },
  TOGGLE_HELPER_ACTIVE (state) {
    state.active = !state.active
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
      resolve()
    })
  },
  toggleHelperActive ({ commit }) {
    return new Promise((resolve) => {
      commit('TOGGLE_HELPER_ACTIVE')
      resolve()
    })
  }

}

export default {
  state,
  mutations,
  actions
}
