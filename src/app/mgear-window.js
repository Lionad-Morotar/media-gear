'use strict'

/* eslint-disable */

import { BrowserWindow, dialog } from 'electron'

class MGearWindow {

  constructor (path) {
    const conf = {
      height: 768,
      width: 1366
    }
    this.window = new BrowserWindow(conf)
    this.registerWindowEvents()
    this.window.loadURL(path)
  }

  registerWindowEvents () {
    this.window.on('close', (e) => {
      const choice = dialog.showMessageBox(
        this.window,
        {
          type: 'question',
          buttons: ['确定', '取消'],
          title: '确认',
          message: '将要关闭窗口?'
        }
      )
      choice === 0 ? (
        mgearApp.windows.splice(mgearApp.windows.indexOf(this), 1),
        mgearApp.windows === 0 && (mgearApp = null)
      ) : (
        e.preventDefault()
      )
    })
  }
}

export default MGearWindow
