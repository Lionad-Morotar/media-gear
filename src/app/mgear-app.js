'use strict'

import MGearWindow from './mgear-window'
import MGearTray from './mgear-tray'

// const { ipcMain } = require('electron')
const shortcut = require('electron-localshortcut')

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

class MGearApplication {
  constructor () {
    this.isFront = false
    this.windows = []
    this.handleWindow = null
    this.trays = []
    this.handleTray = null
    this.init()
  }

  /** Init */

  init () {
    this.initWindow()
    this.initTray()
  }
  initWindow () {
    this.createMainWindow()
    this.registerShortcuts()
  }
  initTray () {
    this.handleTray = new MGearTray()
    this.trays.push(this.handleTray)
    this.registerTrayEvent()
  }

  /** Logicals */

  createMainWindow () {
    const winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:9080`
      : `file://${__dirname}/index.html`
    this.handleWindow = new MGearWindow(winURL)
    this.windows.push(this.handleWindow)
  }
  createWindow () {
    // ...
  }

  registerTrayEvent () {
    this.handleTray.tray.on('click', () => {
      const window = this.handleWindow.window
      window.isVisible() ? window.hide() : window.show()
    })
  }
  registerShortcuts () {
    // TODO 绑定 vuex.helper.active
    shortcut.register('F1', () => {
      console.log('@registerShortcuts: F1')
    })
  }

  /** Destroy */

  destroyTray () {
    this.tray && this.tray.destroy()
  }
}

export default MGearApplication
