import Vue from 'vue'

import HomePage from '@/pages/home'

describe('home.vue', () => {
  it('should render DOM correct', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(HomePage)
    }).$mount()

    expect(vm.$el.querySelector('.title').textContent).to.contain('homepage')
  })
})
