const validatorNameReflex = {
  username: /^[a-zA-Z][a-zA-Z0-9_-]{3,15}$/
}

/**
 * @param {Array, Regex} validItems 待校验的选项
 * @return {Boolean, String} 仅当`return true`时校验通过, 否则输出错误或报错信息
 */
const willValid = (rawValue, validItems) => {
  let validResult = 'unexcepted result'

  switch (typeof validItems) {
    case 'function':
      const result = validItems(rawValue)
      if (['function', 'object'].includes(typeof result)) {
        validResult = willValid(rawValue, result)
      } else {
        validResult = result
      }
      break

    case 'object':
      if (Array.isArray(validItems)) {
        validResult = validItems.map(x => willValid(rawValue, x)).every(x => x === true)
      } else if (validItems instanceof RegExp) {
        validResult = validItems.test(rawValue)
      } else {
        throw new Error(`unsupported object type validItem : ${validItems}`)
      }
      break

    case 'string':
      const handle = validatorNameReflex[validItems]
      if (!handle) {
        throw new Error(`cant find validItem ${validItems} in validatorNameReflex`)
      }
      validResult = willValid(rawValue, handle)
      break

    default:
      throw new Error(`unsupported type of validItem : ${validItems}`)
  }

  if (validResult !== true) {
    throw new Error(validResult)
  }
  return true
}

// TODO test case
// console.log(willValid('a1111', 'username'))
// console.log(willValid('a1111', _ => true))
// console.log(willValid('a1111', _ => false))
// console.log(willValid('a1111', ['username']))
// console.log(willValid('a1111', [_ => true]))
// console.log(willValid('a1111', [_ => true, _ => false]))

export default willValid
