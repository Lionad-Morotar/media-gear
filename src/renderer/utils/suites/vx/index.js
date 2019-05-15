/** 一个非常简单的响应式状态管理 本意用来实现小程序中模板对全局对象中某个属性的订阅 */

import Store from './store'
import Dep from './dep'

let VXID = 1
let handleDep = null

function walkChains (key, obj, fn) {
  const segments = key.split('.')
  let deepObj = obj
  while (segments.length) {
    deepObj = deepObj[segments.shift()]
    fn && fn()
  }
}

class VX {
  constructor () {
    this.id = VXID++
    this.store = Store.createStore()
  }
  async watch (key, fn, options = { immediately: false }, obj = this.store) {
    Dep.watcher = fn
    walkChains(key, obj)
    Dep.watcher = null
    options.immediately && await fn(options.defaultParams)
  }
  unwatch (key, fn, obj = this.store) {
    walkChains(key, obj, () => handleDep.delSub(fn))
  }
  unwatchAll (key, fn, obj = this.store) {
    walkChains(key, obj, () => handleDep.clear())
  }
  set (key, val, options = {}, obj = this.store) {
    // console.log(key, val, obj, this)

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
    if (val && typeof val === 'object' && !(val instanceof Array)) {
      Object.entries(val).map(entry => {
        const [k, v] = entry
        this.set(k, v, {}, val)
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
        return options.formatter ? options.formatter(val) : val
      },
      set: newVal => {
        if (newVal === val) {
          return
        }
        dep.notify(newVal, val)
        val = newVal
      }
    })
  }
  del (key, obj = this.store) {
    walkChains(key, obj, () => handleDep.clear())
    delete obj[key]
  }
  delAll (obj = this.store) {
    Object.keys(obj).map(key => this.del(key))
  }
}

export default VX
