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
  },
  FLUSH_MADROS_WINDOWS (state) {
    state.windows = []
    state.activeWindow = null
  },

  /** window property setting */

  SET_MADROS_WINDOW_TOP (state, { win, top }) {
    const targetWin = win || state.activeWindow
    targetWin.top = top
  },
  SET_MADROS_WINDOW_LEFT (state, { win, left }) {
    const targetWin = win || state.activeWindow
    targetWin.left = left
  },
  SET_MADROS_WINDOW_MINIMIZED (state, { win, val }) {
    const targetWin = win || state.activeWindow
    targetWin.changeWindowVisibleState('minimized', val)
  },
  SET_MADROS_WINDOW_FULL_SCREEN_IN_BODY (state, { win, val }) {
    const targetWin = win || state.activeWindow
    targetWin.changeWindowVisibleState('fullScreenInBody', val)
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
        reject(new Error('window is not an instance of Window'))
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
  },
  flushMadrosWindows ({commit}) {
    commit('FLUSH_MADROS_WINDOWS')
  },

  /** window property setting */

  setMadrosWindowTopLeft ({ commit }, { win, top, left }) {
    return new Promise((resolve, reject) => {
      if (!isNaN(top) && !isNaN(left)) {
        commit('SET_MADROS_WINDOW_TOP', { win, top })
        commit('SET_MADROS_WINDOW_LEFT', { win, left })
        resolve()
      } else {
        reject(new Error('top or left is NaN'))
      }
    })
  },
  setMadrosWindowMinimized ({ commit }, { win, val }) {
    commit('SET_MADROS_WINDOW_MINIMIZED', { win, val })
  },
  setMadrosWindowFullScreenInBody ({ commit }, { win, val }) {
    commit('SET_MADROS_WINDOW_FULL_SCREEN_IN_BODY', { win, val })
  }

}

export default {
  state,
  mutations,
  actions
}
