export function flush (content) {
  return (target, name, descriptor) => {
    const rawFn = descriptor.value
    descriptor.value = function (...arg) {
      this.dispatch('changeStatusBarContent', { content })
      return rawFn.apply(this, arg)
    }
  }
}

export function logInterrupt (content, time) {
  return (target, name, descriptor) => {
    const rawFn = descriptor.value
    descriptor.value = function (...arg) {
      console.log('asdfasdf')
      this.dispatch('interruptStatusBarTask', { content, time })
      return rawFn.apply(this, arg)
    }
  }
}

export default {
  flush,
  logInterrupt
}
