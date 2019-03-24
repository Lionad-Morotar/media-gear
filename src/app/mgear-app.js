'use strict'

/* eslint-disable */

import MGearWindow from './mgear-window'

const shortcut = require('electron-localshortcut')

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

class MGearApplication {

  constructor () {
    this.windows = new Array()
  }

  init () {
    this.createMainWindow()
    this.registerShortcuts()
  }

  createMainWindow () {
    const winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:9080`
      : `file://${__dirname}/index.html`

    this.windows.push(new MGearWindow(winURL))
  }

  registerShortcuts () {
    // TODO 绑定 vuex.helper.active
    shortcut.register('F1', () => {
      console.log('@registerShortcuts: F1')
    })
  }

}

export default MGearApplication
