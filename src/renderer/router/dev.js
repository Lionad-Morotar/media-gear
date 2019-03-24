import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/pages/layout/Layout'

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: 'homepage',
    children: [
      {
        path: 'homepage',
        name: '首页',
        component: () => import('@/pages/home')
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

export default new Router({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes
})
