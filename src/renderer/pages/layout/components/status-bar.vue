<template>
  <div id="status-bar">
    <span>{{content}}</span>
  </div>
</template>

<script>
export default {
  name: 'status-bar-components',
  computed: {
    // TODO autoHide & styles
    // autoHide () {
    //   return this.$store.getter.statusBarAutoHide
    // },
    // autoHideClassNameReflex () {
    //   return this.autoHide ? '' : ''
    // }
    content () {
      return this.$store.getters.statusBarContent
    }
  }
}
</script>

<style lang="scss">
#status-bar {
  height: 25px;
  line-height: 25px;
  border-top: solid 1px #d5d6d6;
  background: #efefef;
}
</style>
