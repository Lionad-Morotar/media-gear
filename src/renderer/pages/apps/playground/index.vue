<template>
  <!-- playground.vue 用来测试正在写的玩意儿 因为一直用Nodemon的感觉有些憋屈 -->
  <div class="playground-app">

    <span>{{this.value}}</span>

  </div>
</template>

<script>

import vx from '@/utils/suites/vx'

export default {
  name: 'playground-app',
  data () {
    return {
      value: ''
    }
  },
  created () {
    vx.set('value', 1)
    vx.addSub('value', _ => {
      this.value = _
    })
  },
  mounted () {
    vx.store.value = '123123'
    setTimeout(() => {
      vx.store.value = '123123321'
    }, 1500)
  },
  destroyed () {
    vx.delAllSub('value')
  }
}
</script>

<style lang="scss" scoped>
.playground-app {
  display: block;
}
</style>
