<template>
  <transition name="fade">

    <div
      v-if="render"
      v-show="visible"
      class="window-body fss-c"
      :style="styles.windowBody"
    >

      <!-- 头部 -->
      <header class="header fsbc">
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
          <i class="iconfont icon-minus" @click="$emit('onClose')"></i>
          <i class="iconfont icon-screen-square" @click="$emit('onClose')"></i>
          <i class="iconfont icon-times" @click="$emit('onClose')"></i>
        </span>
      </header>

      <!-- 躯干 -->
      <section class="main fss-c" :style="styles.modalContentBodyStyle">
        <slot></slot>
      </section>

    </div>

  </transition>
</template>

<script>
export default {
  props: {
    // DOM基础
    id: {
      type: [String, Number],
      default: _ => +String(Math.random() * new Date().getTime()).split('.')[0]
    },
    // TODO 全局窗口状态管理 用来处理 zindex
    width: { type: [String, Number], default: null },
    height: { type: [String, Number], default: null },

    // 配置属性
    render: { type: Boolean, default: true },
    visible: { type: Boolean, default: true },

    // 信息
    title: { type: String, default: '新窗口' },
    step: { type: String, default: '' },
    loading: { type: Boolean, default: false }
  },
  data () {
    return {
      showLoading: false,
      styles: {
        modalContentBodyStyle: {
          width: '100%',
          padding: this.padding,
          minHeight: this.height || 'auto',
          backgroundColor: '#fff',
          boxShadow: this.boxShadow,
          borderRadius: this.borderRadius,
          transition: '.3s'
        }
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
  top: 100px;
  left: 100px;
  width: 500px;
  height: 500px;
  border: solid .5px #5c5c5c;
  background: #fff;
}

.header {
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
  padding: 10px;
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
