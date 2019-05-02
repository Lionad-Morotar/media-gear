import valid from './validator'
import localStorage from './storage'

export default {

  /** getRandomNumber
   *  返回一个随机数字
   *
   * @param {Number} randomGap 随机区间
   *
   *  TODO test
   */
  getRandomNumber (randomGap = 1000) {
    return +new Date() + ((Math.random() * randomGap).toFixed(0) + '')
  },

  /** toPX pxTransform
   *  将输入的数字转化为像素单位
   */
  toPX (input) {
    switch (typeof input) {
      case 'number':
        input = '' + input
        break
    }
    return input + 'px'
  },

  valid,
  localStorage

}
