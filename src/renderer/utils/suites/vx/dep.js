let depID = 1
let watcher = null

class Dep {
  constructor () {
    this.id = depID++
    this.subs = []
  }
  addSub (fn) {
    this.subs[this.subs.length] = fn
  }
  delSub (fn) {
    this.subs.splice(
      this.subs.findIndex(x => x === fn), 1
    )
  }
  clear () {
    this.subs.length = 0
  }
  collect (fn = watcher) {
    if (fn && !this.subs.find(x => x === fn)) {
      this.addSub(fn)
    }
  }
  notify (newVal, oldVal) {
    this.subs.forEach(func => func(newVal, oldVal))
  }
}

// 如果不使用打包工具的话, 这样写要比 Dep.watcher.val 的形式舒服些
Object.defineProperty(Dep, 'watcher', {
  enumerable: false,
  configurable: true,
  get: () => {
    return watcher
  },
  set: newWather => {
    watcher = newWather
  }
})

export default Dep
