'use strict'

import path from 'path'

import { Menu, Tray } from 'electron'

class MGearTray {
  constructor () {
    const iconName = 'strawberry.png'
    const iconPath = path.join(path.join(__dirname, './res'), iconName)
    const tray = new Tray(iconPath)

    // 设置托盘图标标题
    tray.setToolTip('MGear')

    // 设置托盘图标选单
    const rawTrayOptions = []
    rawTrayOptions.push({
      label: '休息提醒',
      type: 'submenu',
      submenu: [
        {
          label: '开关状态',
          type: 'submenu',
          submenu: [
            { label: '打开', type: 'radio', checked: true },
            { label: '关闭', type: 'radio' }
          ]
        }
      ]
    })
    const trayOptions = Menu.buildFromTemplate(rawTrayOptions)
    tray.setContextMenu(trayOptions)
    this.tray = tray
  }
}

export default MGearTray
