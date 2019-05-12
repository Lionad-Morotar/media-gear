
import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState } from 'vuex-electron'

import modules from './modules'
import getters from './getters'

Vue.use(Vuex)

const MGearStore = new Vuex.Store({
  modules,
  getters,
  plugins: [
    // 重新激活 createPersistedState , app.vue 中 startOS 时, 需要对一些特殊情况做处理
    // // disabled and unnecessary, avoid tricky problems from vuex
    createPersistedState()
    // ! disable to fix issue: https://github.com/SimulatedGREG/electron-vue/issues/794
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})

export default MGearStore
