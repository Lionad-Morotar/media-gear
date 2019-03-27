<template>
  <div class="layout-components">

    <!-- 导航栏 -->
    <navbar />

    <!-- 页面内容 -->
    <app-main />

    <!-- status bar -->
    <status-bar />

  </div>
</template>

<script>

import navbar from './components/navbar'
import AppMain from './components/app-main'
import StatusBar from './components/status-bar'

export default {
  name: 'layout-components',
  components: {
    navbar,
    AppMain,
    StatusBar
  }
}
</script>

<style lang="scss" scoped>
.layout-components {
  display: block;
}
</style>
