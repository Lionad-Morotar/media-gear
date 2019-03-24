'use strict'

/* eslint-disable */

import { app } from 'electron'
import MGearApplication from '../app/mgear-app'

let mgearApp

app.on('ready', () => {
  mgearApp = new MGearApplication()
  global.mgearApp = mgearApp
  mgearApp.init()
})

app.on('activate', () => {
  if (mgearApp === null) {
    mgearApp.init()
  }
})
