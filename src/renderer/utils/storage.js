/**
 * 更加便捷的操作 localStorage
 */

const store = ('window' in this) && window.localStorage ? null : {}

const Storage = {
  get (key) {
    const data = store[key] || window.localStorage.getItem(key)
    return data ? JSON.parse(data) : undefined
  },
  del (key) {
    store
      ? (delete store[key])
      : window.localStorage.removeItem(key)
  },
  set (key, rawData) {
    const data = JSON.stringify(rawData)
    store
      ? store[key] = data
      : window.localStorage.setItem(key, data)
  }
}

// for test
// Storage.set(1, 1)
// Storage.set(1, 3)
// Storage.set(2, 1)
// console.log(store)

export default Storage
