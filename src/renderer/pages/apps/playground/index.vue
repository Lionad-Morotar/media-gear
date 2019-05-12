<template>
  <!-- playground.vue 用来测试正在写的玩意儿 因为一直用Nodemon的感觉有些憋屈 -->
  <div class="playground-app">

    <span>{{this.surface}} : {{this.value}}</span>

  </div>
</template>

<script>

import VX from '@/utils/suites/vx'
const vx = new VX()

export default {
  name: 'playground-app',
  data () {
    return {
      value: '',
      surface: ''
    }
  },
  created () {
    vx.set('surface')
    vx.watch('surface', _ => {
      this.surface = _
    })
    vx.set('value.a.b')
    vx.watch('value.a.b', _ => {
      this.value = _
    })
    vx.set('value.a.c')
    vx.watch('value.a.c', _ => {
      this.value += _
    })
    vx.set('value.a.d', { val: '' })
    vx.watch('value.a.d.val', _ => {
      this.value += _
    })
  },
  mounted () {
    this.showReactive()
  },
  destroyed () {
    vx.delAll()
  },
  methods: {
    showReactive () {
      vx.store.surface = '1'
      vx.store.value.a.b = 'a'
      vx.store.value.a.c = 'c1'
      vx.store.value.a.d.val = 'd1'
      setTimeout(() => {
        vx.store.surface = '2'
        vx.store.value.a.b = 'b'
        vx.store.value.a.c = 'c2'
        vx.store.value.a.d.val = 'd2'
        console.log(vx.store)
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
.playground-app {
  display: block;
}
</style>
