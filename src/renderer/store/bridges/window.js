import utils from '@/utils'

export default class Window {
  constructor () {
    this.id = utils.getRandomNumber()
    this.title = '新窗口'
    // 窗口的body部分是否有padding值
    this.fullbody = false
    // 是否在屏幕内最大化(不包含navbar和statusbar)
    this.fullScreenInBody = false
    this.top = 100
    this.left = 100
    this.width = 1000
    this.height = 700
  }
}
