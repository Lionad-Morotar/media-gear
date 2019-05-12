/** 一个非常简单的响应式状态管理 本意用来实现小程序中模板对全局对象中某个属性的订阅 */

import Store from './store'
import Dep from './dep'

export const store = Store.createStore()

export function addSub (key, fn) {
  store.$dep[key].collect(fn)
}

export function set (key, val) {
  if (!store[key]) {
    const dep = new Dep()
    store.$dep[key] = dep
    Object.defineProperty(store, key, {
      enumerable: true,
      configurable: true,
      get () {
        dep.collect()
        return store.$value[key]
      },
      set (newVal) {
        const oldValue = store.$value[key]
        if (newVal === oldValue) {
          return
        }
        dep.notify(newVal, oldValue)
        store.$value[key] = newVal
      }
    })
  }
  store[key] = val
}

export default {
  store,
  set,
  addSub
}
