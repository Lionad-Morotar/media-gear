<template>
  <transition name="fade">
    <div v-if="render" v-show="visible" class="window-body" :style="styles.body">

      <!-- 头部 -->
      <header class="header fsbc fs0">
        <div v-if="step">
          <i class="iconfont icon-double-right"></i>
          <span class="title">{{step}}</span>
        </div>
        <div v-else-if="showLoading">
          <i class="iconfont icon-spinner loading"></i>
          <span class="title">{{showLoading}}</span>
        </div>
        <div v-else>
          <i class="iconfont icon-align-justify"></i>
          <span class="title">{{title}}</span>
        </div>

        <span class="right">
          <i class="iconfont icon-minus" @click="$emit('onMini')"></i>
          <i class="iconfont icon-screen-square" @click="$emit('onFullScreen')"></i>
          <i class="iconfont icon-times" @click="$emit('onClose')"></i>
        </span>
      </header>

      <!-- 躯干 -->
      <section class="main fss-c" :style="styles.main">
        <slot></slot>
      </section>

    </div>
  </transition>
</template>

<script>
import utils from '@/utils'

const HEADER_HEIGHT = 25

export default {
  props: {
    render: { type: Boolean, default: true },
    visible: { type: Boolean, default: true },
    win: { type: Object, required: true }
  },
  data () {
    return {
      showLoading: false,
      title: this.win.title,
      step: this.win.step,
      loading: this.win.loading,
      styles: {
        body: {
          width: utils.toPX(this.win.width),
          height: utils.toPX(this.win.height),
          top: utils.toPX(this.win.top),
          left: utils.toPX(this.win.left)
        },
        main: Object.assign(
          {
            padding: utils.toPX(10),
            paddingTop: utils.toPX(10 + HEADER_HEIGHT)
          },
          // TODO 这种写法太惨
          this.win.fullbody ? {
            padding: utils.toPX(0),
            paddingTop: utils.toPX(HEADER_HEIGHT)
          } : {}
        )
      }
    }
  },
  watch: {
    loading (nv, ov) {
      if (ov && !nv) {
        setTimeout(() => {
          this.showLoading = ''
        }, 500)
      } else {
        this.showLoading = nv
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.window-body {
  position: absolute;
  border: solid .5px #5c5c5c;
  background: #fff;
  overflow: hidden;
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  padding: 3px 3px;
  width: 100%;
  height: 25px;
  line-height: 25px;
  text-align: left;
  background-color: #f5f5f5;

  .right {
    .iconfont {
      margin-left: 3px;
    }
  }

  .title {
    font-size: 12px;

    .loading {
      animation: goRotate 1s linear infinite;
    }
    @keyframes goRotate {
      from {
        opacity: 0.8;
        transform: rotate(0deg);
      }
      to {
        opacity: 0.9;
        transform: rotate(360deg);
      }
    }
  }
}

.main {
  width: 100%;
  height: 100%;
  // overflow-x: hidden;
  // overflow-y: scroll;
}

.fade-enter-active, .fade-leave-active {
  opacity: .5;
  transition: 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  -webkit-transform: scale(1.02);
  transform: scale(1.02);
  transition: 0.3s;
}
</style>
