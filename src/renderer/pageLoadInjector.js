
import NProgress from 'nprogress'

import 'nprogress/nprogress.css'

import router from './router'

NProgress.configure({ showSpinner: false })

// eslint-disable-next-line no-unused-vars
router.beforeEach((to, from, next) => {
  NProgress.start()

  // 需要手动调用`next`跳转页面
  next()
})

/**
 * router 跳转完成后 结束进度条
 * next({ url: ... }) 跳转不会触发这个函数,
 * 所以某些时候需要手动执行 NProgress.done()
 */
router.afterEach(() => {
  NProgress.done()
})
