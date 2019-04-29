<template>
  <section id="app-main">
    <keep-alive>
      <router-view :key="key" />
    </keep-alive>
  </section>
</template>

<script>
export default {
  name: 'app-main-components',
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
  overflow-y: scroll;
}
</style>

