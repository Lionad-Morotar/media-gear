<template>
  <transition name="fade">
    <div v-show="win && render" class="window-body" :style="bodyStyles">

      <!-- 头部 -->
      <header class="header fsbc fs0" @mousedown="handleDragStart">
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

        <!-- TODO 事件代理 -->
        <span class="right">
          <i class="iconfont icon-minus" @click.stop="toggleMinimized"></i>
          <i class="iconfont icon-screen-square" @click.stop="toggleFullScreenInBody"></i>
          <!-- <i class="iconfont icon-times" @click.stop="$emit('onClose')"></i> -->
        </span>
      </header>

      <!-- 躯干 -->
      <section class="main fss-c" :style="styles.main">
        <slot />
      </section>

    </div>
  </transition>
</template>

<script>
import utils from '@/utils'

const HEADER_HEIGHT = 25

export default {
  props: {
    win: { type: Object, required: true }
  },
  data () {
    return {
      render: true,
      showLoading: false,
      title: this.win.title,
      step: this.win.step,
      loading: this.win.loading,
      styles: {
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
  computed: {
    bodyStyles: {
      get () {
        const stylesToMatchSideEffects = {
          minimized: () => {
            this.render = false
          },
          fullScreenInBody: () => {
            this.render = true
          },
          default: () => {
            this.render = true
          }
        }
        const stylesToMatch = {
          minimized: () => {
            return this.win.minimized ? {} : false
          },
          fullScreenInBody: () => {
            return this.win.fullScreenInBody ? {
              width: '100%',
              height: '100%',
              top: 0,
              left: 0
            } : false
          },
          default: () => {
            return {
              width: utils.toPX(this.win.width),
              height: utils.toPX(this.win.height),
              top: utils.toPX(this.win.top),
              left: utils.toPX(this.win.left)
            }
          }
        }
        const pattern = ['default', 'fullScreenInBody', 'minimized']
        let result = null
        let mathed = null
        while (!result) {
          result = stylesToMatch[mathed = pattern.pop()]()
          // 虽然minimized状态下, DOM节点被v-show接管,
          // 但返回的样式应该是minimized上一优先级状态下的样式
          // 这样的话, width height 之类的属性不会被修改,
          // 使得transition的动画内, window不会形变
          if (mathed === 'minimized' && result) {
            let lastResult = null
            while (!lastResult) {
              lastResult = stylesToMatch[pattern.pop()]()
            }
            result = lastResult
          }
        }
        console.assert(!pattern.includes(mathed), '获取窗口样式出错', mathed)
        stylesToMatchSideEffects[mathed]()
        return result
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
  },
  methods: {

    /** screen event */

    toggleMinimized () {
      this.$store.dispatch('setMadrosWindowMinimized', { val: !this.win.minimized, win: this.win })
    },
    toggleFullScreenInBody () {
      this.$store.dispatch('setMadrosWindowFullScreenInBody', { val: !this.win.fullScreenInBody, win: this.win })
    },

    /** drag event */

    handleDragStart (e) {
      const mouseStartX = e.clientX
      const mouseStartY = e.clientY
      const mouseDownWinTop = this.win.top
      const mouseDownWinLeft = this.win.left

      const onMouseMove = e => {
        const offsetX = +e.clientX - mouseStartX
        const offsetY = +e.clientY - mouseStartY
        const fixedX = offsetX + mouseDownWinLeft
        const fixedY = offsetY + mouseDownWinTop
        this.setNotOverBoard(fixedX, fixedY)
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      utils.canselEvent(e)
    },
    setNotOverBoard (fixedX, fixedY) {
      this.$store.dispatch(
        'setMadrosWindowTopLeft',
        this.fixXYIfOverBoard(fixedX, fixedY)
      )
    },
    fixXYIfOverBoard (x = 0, y = 0) {
      // TODO 存入Vuex
      const electronWinWidth = window.screen.availWidth
      const electronWinHeight = window.screen.availHeight
      const maxWidth = electronWinWidth - this.win.width
      const maxHeight = electronWinHeight - this.win.height
      x = x < 0 ? 0 : x
      x = x > maxWidth ? maxWidth : x
      y = y < 0 ? 0 : y
      y = y > maxHeight ? maxHeight : y
      return { left: x, top: y }
    }
  }
}
</script>

<style lang="scss" scoped>
.window-body {
  position: absolute;
  padding: .5px;
  border: solid .5px #5c5c5c;
  background: #fff;
  overflow: hidden;
  // transition: .3s;
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 3px;
  width: 99.9%;
  height: 25px;
  line-height: 25px;
  text-align: left;
  background-color: #f5f5f5;
  cursor: move;

  .right {
    cursor: pointer;

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

.fade-enter-active,
.fade-leave-active {
  opacity: 1;
  transition: .1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(.94);
}
</style>
