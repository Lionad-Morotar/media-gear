const state = {
  autoHide: false,
  content: '',
  // TODO re. use nodelist instead of array
  task: [],
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

  /** content, task & history */

  ADD_STATUS_BAR_TASK (state, val) {
    state.task.push(val)
  },
  INTERRUPT_STATUS_BAR_TASK (state, val) {
    state.task.unshift(val)
  },
  NEXT_STATUS_BAR_TASK (state, val) {
    const lastContent = state.content
    state.history.push(lastContent)
    console.log('asdfasdf')
    state.content = state.task.shift()
  },
  SET_STATUS_BAR_CONTENT (state, val) {
    state.history.push(val)
    console.log('asdfasdf2')
    state.content = val
  }

}

const actions = {

  /** autoHide */

  activeStatusBarAutoHide ({ commit }) {
    commit('ACTIVE_STATUS_BAR_AUTO_HIDE')
  },
  deactiveStatusBarAutoHide ({ commit }) {
    commit('DEACTIVE_STATUS_BAR_AUTO_HIDE')
  },
  toggleHelperActive ({ state, dispatch }) {
    state.active
      ? dispatch('deactiveStatusBarAutoHide')
      : dispatch('activeStatusBarAutoHide')
  },

  /** content, task & history */

  addStatusBarTask ({ commit }, { content }) {
    commit('ADD_STATUS_BAR_TASK', content)
  },
  interruptStatusBarTask ({ state, commit, dispatch }, { content, time = 500 }) {
    const oldContent = state.content
    dispatch('changeStatusBarContent', { content })
    commit('INTERRUPT_STATUS_BAR_TASK', oldContent)
    setTimeout(() => {
      dispatch('nextStatusBarTask')
    }, time)
  },
  nextStatusBarTask ({ commit }) {
    commit('NEXT_STATUS_BAR_TASK')
  },
  changeStatusBarContent ({ commit }, { content }) {
    // TODO validator decorator
    // TODO task type
    if (typeof content === 'string') {
      commit('SET_STATUS_BAR_CONTENT', content)
    }
  }

}

export default {
  state,
  mutations,
  actions
}
