import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/pages/layout/Layout'

Vue.use(Router)

const routes = [
  {
    path: '/404',
    name: '404 Not Found',
    components: () => import('@/pages/errorPages/404')
  },
  {
    path: '',
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
    redirect: ''
  }
]

export default new Router({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes
})
