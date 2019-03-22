<template>
  <div class="layout-components">

    <!-- 导航栏 -->
    <navbar />

    <!-- 页面内容 -->
    <app-main />

  </div>
</template>

<script>

import Navbar from './components/Navbar'
import AppMain from './components/AppMain'

export default {
  name: 'layout-components',
  components: {
    Navbar,
    AppMain
  }
}
</script>

<style lang="scss" scoped>
.layout-components {
  display: block;
}
</style>