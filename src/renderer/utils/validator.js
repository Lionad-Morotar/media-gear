// 校验用到的工具函数或工具对象
const comm = {
  regex: {
    count (countStr) {
      if (countStr === '*') {
        return '*'
      } else {
        return `{${countStr}}`
      }
    },
    email: {
      whiteLists: ['qq.com', '163.com', 'vip.163.com', '263.net', 'yeah.net', 'sohu.com', 'sina.cn', 'sina.com', 'eyou.com', 'gmail.com', 'hotmail.com']
    },
    number: {
      areaLabelReflex: {
        both: '-?',
        neg: '-',
        pos: ''
      }
    }
  }
}

// 默认的正则校验器
const validatorNameReflex = {

  /** social media */

  username ({ min = 4, max = 16 }) {
    return new RegExp(`^[a-zA-Z][a-zA-Z0-9_-]{${min - 1},${max - 1}}$`)
  },
  username_cn ({ min = 2, max = 8 }) {
    return new RegExp(`^[a-zA-Z\\u4E00-\\u9FA5][a-zA-Z0-9\\u4E00-\\u9FA5_-]{${min - 1},${max - 1}}$`)
  },
  email () {
    return new RegExp(`^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,6})$`)
  },
  email_general () {
    return new RegExp(`^([A-Za-z0-9_\\-\\.])+\\@(${comm.regex.email.whiteLists.join('|')})$`)
  },
  mobile: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/,
  idcard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,

  /** general */

  interger ({ area = 'both' }) {
    return new RegExp(`^${comm.regex.number.areaLabelReflex[area]}\\d+$`)
  },
  float ({ area = 'both', count = '*' }) {
    return new RegExp(`^${comm.regex.number.areaLabelReflex[area]}\\d*\\.\\d${comm.regex.count(count)}$`)
  },
  url: /^((https?|ftp|file):\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/
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
      const toFindHandle = validItems.split('?')
      const toFindHandleName = toFindHandle[0]
      const handle = validatorNameReflex[toFindHandleName]
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
