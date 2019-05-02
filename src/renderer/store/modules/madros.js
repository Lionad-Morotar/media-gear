import Window from '../bridges/window'

const state = {
  windows: [],
  activeWindow: null
}

const mutations = {

  /** windows */

  ACTIVE_MADROS_WINDOW (state, win) {
    state.activeWindow = state.windows.find(x => x === win)
  },
  DEACTIVE_MADROS_WINDOW (state) {
    state.activeWindow = null
  },
  ADD_MADROS_WINDOW (state, win) {
    state.windows.push(win)
  },
  DEL_MADROS_WINDOW (state, win) {
    state.windows.splice(state.windows.find(x => x === win), 1)
    if (state.activeWindow === win) {
      state.activeWindow = null
    }
  }

}

const actions = {

  /** windows */

  activeMadrosWindow ({ commit }, newWin) {
    return new Promise((resolve, reject) => {
      if (newWin instanceof Window) {
        commit('ACTIVE_MADROS_WINDOW', newWin)
        resolve()
      } else {
        reject(new Error('$activeMadrosWindow : window is not an instance of Window'))
      }
    })
  },
  deactiveMadrosWindow ({ commit }) {
    commit('DEACTIVE_MADROS_WINDOW')
  },
  createMadrosWindow ({ commit }, payload = { config: {} }) {
    return new Promise(resolve => {
      const { config } = payload
      const newWin = Object.assign(new Window(), config)
      commit('ADD_MADROS_WINDOW', newWin)
      resolve(newWin)
    })
  },
  delMadrosWindow ({ commit }, { window }) {
    commit('DEL_MADROS_WINDOW', window)
  }

}

export default {
  state,
  mutations,
  actions
}
