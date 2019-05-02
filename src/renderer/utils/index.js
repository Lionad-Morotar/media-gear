import valid from './validator'
import localStorage from './storage'

export default {

  valid,
  localStorage,

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

  /** canselEvent
   *  取消默认事件同时取消事件传播
   */
  canselEvent (e) {
    e.preventDefault && e.preventDefault()
    e.stopPropagation && e.stopPropagation()
  },

  /** 打印原型链 */
  protoChain (object) {
    const p = Object.getPrototypeOf(object)
    console.log(p)
    return p === null || this.protoChain(p)
  }

}
