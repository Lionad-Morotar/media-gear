<template>
  <div id="navbar" class="fsc">
    <div class="win-icon window-icon">
      <i class="iconfont icon-windows white" />
    </div>
    <template v-for="window in windows">
      <div class="win-item">
        <span class="item-title">{{window.title}}</span>
      </div>
    </template>
  </div>
</template>

<script>

export default {
  name: 'navbar-cmpt',
  computed: {
    windows () {
      return this.$store.getters.windows
    },
    activeWindow () {
      return this.$store.getters.activeWindow
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 40px;
$bgc: #222;
$bgc-light: #444;
#navbar {
  height: $height;
  line-height: $height;
  background:$bgc;

  .win-icon,
  .win-item {
    display: inline-block;
    flex-shrink: 0;
    height: $height;
    line-height: $height;
  }

  .win-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: $height;
    height: $height;
  }

  .win-item {
    min-width: 100px;
    background: $bgc-light;
    text-align: center;
    border-right: solid 1px $bgc;

    .item-title {
      font-size: 12px;
      color: #fff;
      letter-spacing: 1px;
    }
  }
}
</style>
