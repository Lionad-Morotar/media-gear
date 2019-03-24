import Vue from 'vue'
Vue.config.devtools = false
Vue.config.productionTip = false

/** unit test */
// TODO 单文件测试
// console.log('@@@@@@@@@@@@@@@@@@@', !process.env.TEST_FILE, process.env.TEST_FILE)
// let fileNameRe = null
// if (!process.env.TEST_FILE) {
//   fileNameRe = /\.spec$/
// } else {
//   console.log(new RegExp(`/(${process.env.TEST_FILE.split(',').join('|')})\.spec$/`))
//   fileNameRe = new RegExp(`/(${process.env.TEST_FILE.split(',').join('|')})\.spec$/`)
// }
// console.log('@@@@@@@@@@@@@@@@@@@', fileNameRe, JSON.stringify(fileNameRe))
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

/** coverage test - closed for a while */

// const srcContext = require.context('../../src/renderer', true, /^\.\/(?!main(\.js)?$)/)
// srcContext.keys().forEach(srcContext)

