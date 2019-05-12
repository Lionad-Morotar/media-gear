/** 一个非常简单的响应式状态管理 本意用来实现小程序中模板对全局对象中某个属性的订阅 */

import Store from './store'
import Dep from './dep'

class VX {
  constructor () {
    this.store = Store.createStore()
  }
  addSub (key, fn) {
    this.store.$dep[key].collect(fn)
  }
  set (key, val) {
    if (!this.store[key]) {
      const dep = new Dep()
      this.store.$dep[key] = dep
      Object.defineProperty(this.store, key, {
        enumerable: true,
        configurable: true,
        get: () => {
          dep.collect()
          return this.store.$value[key]
        },
        set: (newVal) => {
          const oldValue = this.store.$value[key]
          if (newVal === oldValue) {
            return
          }
          dep.notify(newVal, oldValue)
          this.store.$value[key] = newVal
        }
      })
    }
    this.store[key] = val
  }
}

export default VX
