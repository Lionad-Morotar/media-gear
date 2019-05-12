function createStore (wrapper, key) {
  const newStore = {}
  if (wrapper && key) {
    wrapper.key = newStore
    return wrapper
  } else {
    return newStore
  }
}

export default {
  createStore
}
