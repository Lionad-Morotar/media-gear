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
    vx.set('value', { a: { b: '' } })
    vx.watch('value.a.b', _ => {
      this.value = _
    })
  },
  mounted () {
    vx.store.surface = '1'
    vx.store.value.a.b = 'a'
    setTimeout(() => {
      vx.store.surface = '2'
      vx.store.value.a.b = 'b'
      console.log(vx.store)
    }, 1500)
  },
  destroyed () {
    // vx.delAllSub('value')
  }
}
</script>

<style lang="scss" scoped>
.playground-app {
  display: block;
}
</style>
