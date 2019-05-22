import Window from '../bridges/window'

const ZINDEX = {
  // 达到阈值时重拍windows的zIndex为排序后的顺序
  // 如[1,2]经过49次ZINDEX变化后, 会成为[27,26],
  // 如果执行RESORT_THRESHOLD, 就会将其重设其为[2,1]
  RESORT_THRESHOLD_COUNT: 50,
  CURRENT: 1,
  COUNT: 0,
  // 将所有windows的zIndex重设为由1开始
  RESORT_THRESHOLD (windows) {
    const winSort = windows.map(_ => _).sort((a, b) => a.zIndex - b.zIndex)
    winSort.map((win, idx) => {
      win.zIndex = idx + 1
    })
    this.CURRENT = winSort.length
    this.COUNT = 0
  }
}

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
  },
  INC_MADROS_WINDOW_ZINDEX (state, { win }) {
    const targetWin = win || state.activeWindow

    if (targetWin.zIndex !== ZINDEX.CURRENT) {
      if (ZINDEX.COUNT++ > ZINDEX.RESORT_THRESHOLD_COUNT) {
        ZINDEX.RESORT_THRESHOLD(state.windows)
      }
      targetWin.zIndex = ++ZINDEX.CURRENT
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
      const newWin = Object.assign(new Window({ zIndex: ZINDEX.CURRENT++ }), config)
      commit('ADD_MADROS_WINDOW', newWin)
      resolve(newWin)
    })
  },
  delMadrosWindow ({ state, commit }, { window }) {
    commit('DEL_MADROS_WINDOW', window)
    ZINDEX.RESORT_THRESHOLD(state.windows)
  },
  flushMadrosWindows ({ state, commit }) {
    commit('FLUSH_MADROS_WINDOWS')
    ZINDEX.RESORT_THRESHOLD(state.windows)
  },

  /** window property setting */

  setMadrosWindowTopLeft ({ commit }, { win, top, left }) {
    return new Promise((resolve, reject) => {
      if (!isNaN(top) && !isNaN(left)) {
        commit('INC_MADROS_WINDOW_ZINDEX', { win })
        commit('SET_MADROS_WINDOW_TOP', { win, top })
        commit('SET_MADROS_WINDOW_LEFT', { win, left })
        resolve()
      } else {
        reject(new Error('top or left is NaN'))
      }
    })
  },
  setMadrosWindowFront ({ commit }, { win }) {
    commit('INC_MADROS_WINDOW_ZINDEX', { win })
  },
  setMadrosWindowMinimized ({ commit }, { win, val }) {
    commit('SET_MADROS_WINDOW_MINIMIZED', { win, val })
  },
  setMadrosWindowFullScreenInBody ({ commit }, { win, val }) {
    commit('INC_MADROS_WINDOW_ZINDEX', { win })
    commit('SET_MADROS_WINDOW_FULL_SCREEN_IN_BODY', { win, val })
  }

}

export default {
  state,
  mutations,
  actions
}
