/** 一个非常简单的响应式状态管理 本意用来实现小程序中模板对全局对象中某个属性的订阅 */

export const store = {
  $watcher: {},
  $value: {}
}

export function delSub (key, sub) {
  store.$watcher[key].splice(
    store.$watcher[key].findIndex(x => x === sub), 1
  )
}
export function delAllSub (key) {
  store.$watcher[key] = []
}

export function addSub (key, val) {
  if (!store.$watcher[key]) {
    store.$watcher[key] = [val]
  } else {
    store.$watcher[key].push(val)
  }
}
export function addSubAndTrigger (key, val, ...params) {
  return new Promise(resolve => {
    addSub(key, val)
    const handle = val(...params)
    if (handle instanceof Promise) {
      handle.then(resolve())
    } else {
      resolve()
    }
  })
}

export function set (key, val, formater) {
  // console.log('@Store : ', key, val, formater)
  const callWatcher = (cVal) => {
    if (!store.$watcher[key]) {
      store.$watcher[key] = []
    } else {
      store.$watcher[key].forEach(func => func(cVal))
    }
  }
  const callFormater = formater

  if (!store[key]) {
    Object.defineProperty(store, key, {
      enumerable: true,
      configurable: true,
      get () {
        return callFormater
          ? callFormater(store.$value[key])
          : store.$value[key]
      },
      set (newVal) {
        const lastValue = store.$value[key]
        if (newVal === lastValue) {
          return
        }
        callWatcher(newVal)
        store.$value[key] = newVal
      }
    })
  }
  store[key] = val
}

export function del (key) {
  delete store[key]
  // TODO 顺便删除依赖
}

export function get (key) {
  return store[key]
}

export default {
  store,
  set,
  get,
  del,
  addSub,
  addSubAndTrigger,
  delSub,
  delAllSub
}
