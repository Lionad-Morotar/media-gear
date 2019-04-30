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
      whiteLists: [
        'qq.com',
        '163.com',
        'vip.163.com',
        '263.net',
        'yeah.net',
        'sohu.com',
        'sina.cn',
        'sina.com',
        'eyou.com',
        'gmail.com',
        'hotmail.com'
      ]
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

// 内置的校验器
const validatorNameReflex = {

  /** social media */

  // 用户名
  username ({ min = 4, max = 16 }) {
    return new RegExp(`^[a-zA-Z][a-zA-Z0-9_-]{${min - 1},${max - 1}}$`)
  },
  // 中文用户名
  username_cn ({ min = 2, max = 8 }) {
    return new RegExp(`^[a-zA-Z\\u4E00-\\u9FA5][a-zA-Z0-9\\u4E00-\\u9FA5_-]{${min - 1},${max - 1}}$`)
  },
  // 油箱
  email () {
    return new RegExp(`^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,6})$`)
  },
  // 常用邮箱
  email_general () {
    return new RegExp(`^([A-Za-z0-9_\\-\\.])+\\@(${comm.regex.email.whiteLists.join('|')})$`)
  },
  // 手机号码
  mobile: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/,
  // 身份证
  idcard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,

  /** general */

  // 整数
  interger ({ area = 'both' }) {
    return new RegExp(`^${comm.regex.number.areaLabelReflex[area]}\\d+$`)
  },
  // 浮点数
  float ({ area = 'both', count = '*' }) {
    return new RegExp(`^${comm.regex.number.areaLabelReflex[area]}\\d*\\.\\d${comm.regex.count(count)}$`)
  },
  // URL
  url: /^((https?|ftp|file):\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/
}

/**
 * @param {Array, Regex} validItems 待校验的选项
 * @return {Boolean, String} 仅当`return true`时校验通过, 否则输出错误或报错信息
 */
class Valy {
  constructor ({ rawValue, rawValidItems, debug }) {
    Object.assign(this, {
      validResult: null,
      rawValue,
      rawValidItems,
      debug: debug || false
    })
  }

  toValid (validItems) {
    let validResult = 'unexcepted valid result'
    validItems = validItems || this.rawValidItems

    switch (typeof validItems) {
      case 'function':
        this.debug && console.log('function')
        const result = validItems(this.rawValue)
        if (['function', 'object'].includes(typeof result)) {
          validResult = this.toValid(result)
        } else {
          validResult = result
        }
        break

      case 'object':
        this.debug && console.log('object')
        if (Array.isArray(validItems)) {
          validResult = validItems
            .map(x => this.toValid(x))
            .every(x => x === true)
        } else if (validItems instanceof RegExp) {
          validResult = validItems.test(this.rawValue)
        } else {
          throw new Error(`unsupported object type validItem : ${validItems}`)
        }
        break

      case 'string':
        this.debug && console.log('string')
        const toFindHandle = validItems.split('?')
        const toFindHandleName = toFindHandle[0]
        const handle = validatorNameReflex[toFindHandleName]
        if (!handle) {
          throw new Error(`cant find validItem ${validItems} in validatorNameReflex`)
        }
        validResult = this.toValid(handle)
        break

      default:
        throw new Error(`unsupported type of validItem : ${validItems}`)
    }

    // TODO 在某些情况下可能要求抛出异常
    // if (validResult !== true) {
    //   throw new Error(validResult)
    // }
    // return true
    return validResult
  }

  // 对值进行格式化
  format (fn = _ => _) {
    this.rawValue = fn(this.rawValue)
    return this
  }

  // 返回校验结果
  exec () {
    this.validResult = this.toValid()
    return this.validResult
  }

  // 返回判断检验结果是否为某一特定的值
  check (checkResult = true) {
    return this.validResult === checkResult
  }
}

console.log(
  new Valy({rawValue: 'a1111', rawValidItems: 'username'}).format().exec()
)

// TODO test case
// 验证内置校验器是否正常
// console.log(willValid('a1111', 'username'))
// 验证函数校验器是否正常
// console.log(willValid('a1111', _ => true))
// console.log(willValid('a1111', _ => false))
// 验证数据校验器是否正常
// console.log(willValid('a1111', ['username']))
// console.log(willValid('a1111', [_ => true]))
// console.log(willValid('a1111', [_ => true, _ => false]))

// export default willValid
