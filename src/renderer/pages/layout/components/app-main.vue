<template>
  <section id="app-main">
    <keep-alive>
      <router-view :key="key" />
    </keep-alive>
  </section>
</template>

<script>
export default {
  // 这一层打算主要用作缓存
  name: 'app-main-cmpt',
  computed: {
    key () {
      return this.$route.fullPath
    }
  }
}
</script>

<style scoped>
#app-main {
  height: calc(100vh - 65px);
  width: 100%;
  position: relative;
}
</style>

