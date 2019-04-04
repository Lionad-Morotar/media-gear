'use strict'

import { app } from 'electron'
import MGearApplication from '../app/mgear-app'

let mgearApp

app.on('ready', () => {
  global.mgearApp = mgearApp = new MGearApplication()
  handleTrayEvent()
})

app.on('activate', () => {
  if (mgearApp === null) {
    mgearApp.init()
  }
})

function handleTrayEvent () {
  console.log(mgearApp)
  // mgearApp.tray.on('click', () => {
  //   console.log('1')
  //   mgearApp.isVisible() ? mgearApp.hide() : mgearApp.show()
  // })
}
