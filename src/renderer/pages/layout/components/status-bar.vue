<template>
  <div id="status-bar" class="fsbc">

    <!-- content -->
    <span>{{content}}</span>

    <!-- like -->
    <div class="heart" :class="heartState" @click="animateHeart"></div>

  </div>
</template>

<script>
export default {
  name: 'status-bar-components',
  data () {
    return {
      heartState: []
    }
  },
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
  },
  methods: {
    animateHeart () {
      if (!this.heartState.includes('is-animating')) {
        this.heartState.push('is-animating')
        setTimeout(() => {
          if (!this.heartState.includes('is-done')) {
            this.heartState.push('is-done')
          }
        }, 800)
      }
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
  overflow: hidden;
}

.heart {
  height: 50px;
  width: 50px;
  background-image: url('./res/like.png');
  background-position: left;
  background-repeat: no-repeat;
  background-size: 2900%;
  cursor: pointer;

  &.is-animating {
    animation-name: heart-burst;
    animation-duration: 800ms;
    animation-timing-function: steps(28);
    animation-iteration-count: 1;
  }
  &.is-done {
    background-position: right;
  }

  @keyframes heart-burst {
    from {
      background-position: left;
    }
    to {
      background-position: right;
    }
  }
}

</style>
