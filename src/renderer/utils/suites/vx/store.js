function createStore (wrapper, key) {
  const newStore = {
    $dep: {}
  }
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
