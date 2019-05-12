let depID = 1
let watcher = {
  hook: null
}

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
  collect (fn = watcher.hook) {
    if (fn && !this.subs.find(x => x === fn)) {
      this.addSub(fn)
    }
  }
  notify (newVal, oldVal) {
    this.subs.forEach(func => func(newVal, oldVal))
  }
}

Dep.watcher = watcher

export default Dep
