import utils from '@/utils'

export default class Window {
  /**
   * @param fullbody 窗口的body部分是否有padding值
   * @param fullScreenInBody 是否在屏幕内最大化(不包含navbar和statusbar)
   * @param minimized 最小化窗口
   */
  constructor (config) {
    this.id = utils.getRandomNumber()

    /** window attr */

    this.title = '新窗口'
    this.fullbody = false
    this.fullScreenInBody = false
    this.minimized = false

    /** DOM val */

    this.top = 100
    this.left = 100
    this.width = 1000
    this.height = 700
    this.zIndex = config.zIndex || 1
  }
  changeWindowVisibleState (name, val) {
    const handler = {
      fullScreenInBody: {
        true: () => toFullScreen(),
        false: () => toNormal()
      },
      minimized: {
        true: () => toMinimize(),
        false: () => toUnMinimize()
      }
    }
    const toMinimize = () => {
      this.minimized = true
    }
    const toUnMinimize = () => {
      this.minimized = false
    }
    const toFullScreen = () => {
      this.fullScreenInBody = true
      this.minimized = false
    }
    const toNormal = () => {
      this.fullScreenInBody = false
      this.minimized = false
    }

    const handle = handler[name]
    const handleFn = handle && handle[val]
    handleFn && handleFn()
  }
}
