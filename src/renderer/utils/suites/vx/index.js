/** 一个非常简单的响应式状态管理 本意用来实现小程序中模板对全局对象中某个属性的订阅 */

import Store from './store'
import Dep from './dep'

let VXID = 1
let handleDep = null

class VX {
  constructor () {
    this.id = VXID++
    this.store = Store.createStore()
  }
  watch (key, fn, obj = this.store) {
    Dep.watcher = fn
    const segments = key.split('.')
    while (segments.length) {
      obj = obj[segments.shift()]
    }
    Dep.watcher = null
  }
  set (key, val, obj = this.store) {
    /** 对象值链 */
    const segments = key.split('.')
    while (segments.length > 1) {
      const handleKey = segments.shift()
      const handleVal = obj[handleKey]
      if (typeof handleVal === 'object') {
        obj = handleVal
      } else if (!handleVal) {
        obj = (
          key = handleKey,
          obj[handleKey] = {},
          obj[handleKey]
        )
      } else {
        console.warn('already has val')
      }
    }
    key = segments[0]
    /** walk */
    if (typeof val === 'object' && !(val instanceof Array)) {
      Object.entries(val).map(entry => {
        const [k, v] = entry
        this.set(k, v, val)
      })
    }
    /** defineProperty */
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: () => {
        handleDep = dep
        handleDep.collect()
        return val
      },
      set: newVal => {
        if (newVal === val) {
          return
        }
        val = newVal
        dep.notify(newVal, val)
      }
    })
    return dep
  }
  del (key, obj = this.store) {
    const segments = key.split('.')
    let deepObj = obj
    while (segments.length) {
      deepObj = deepObj[segments.shift()]
      handleDep.clear()
    }
    delete obj[key]
  }
  delAll (obj = this.store) {
    Object.keys(obj).map(key => this.del(key))
  }
}

export default VX
