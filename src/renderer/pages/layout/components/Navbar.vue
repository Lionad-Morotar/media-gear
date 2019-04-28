<template>
  <div id="navbar">
    <i class="iconfont icon-windows white" />
  </div>
</template>

<script>

export default {
  name: 'navbar-components'
}
</script>

<style lang="scss">
$navbar-height: 40px;
#navbar {
  padding: 0 15px;
  height: $navbar-height;
  line-height: $navbar-height;
  background:#222;

  .iconfont {
    cursor: pointer;
  }
}
</style>
