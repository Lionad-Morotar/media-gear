import utils from '@/utils'

export default class Window {
  constructor () {
    this.id = utils.getRandomNumber()
    this.title = '新窗口'
    this.top = 100
    this.left = 100
    this.width = 1000
    this.height = 700
  }
}
