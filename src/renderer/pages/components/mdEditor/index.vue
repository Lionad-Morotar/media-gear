<template>
  <div :id="id" class="t-editor">

    <div class="wrapper fss max">
      <textarea
        ref="left-panel"
        class="left-panel left"
        v-model="value"
        @scroll="scroll($event, 'left')"
      />
      <div class="panel-gap"></div>
      <div
        ref="right-panel"
        class="right-panel right"
        @scroll="scroll($event, 'right')"
      >
        <div
          class="right-panel-content"
          v-html="parsedValue"
        />
      </div>
    </div>

  </div>
</template>

<script>

import { parse } from './strParser'

const basicOptions = {}

export default {
  name: 't-editor',
  props: {

    // 编辑器ID
    id: {
      type: String,
      default () {
        return 'markdown-editor-' + this.$utils.getRandomNumber()
      }
    },

    // 扩充选项
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      value: '',
      parsedValue: '',
      timer: {
        parse: null,
        scroll: null,
        time: +new Date()
      },
      memo: {}
    }
  },

  computed: {
    innerOptions () {
      const options = Object.assign({}, basicOptions, this.options)

      return options
    }
  },
  watch: {
    value (n, o) {
      if (!this.timer.parse) {
        // if (this.memo[n]) {
        //   this.parsedValue = this.memo[n]
        // } else {
        //   this.memo[n] = this.parsedValue = parse(n)
        // }
        this.parsedValue = parse(n)
        this.timer.parse = setTimeout(() => {
          this.timer.parse = null
        }, 200)
      }
    }
  },

  mounted () {
    this.initEditor()
  },

  methods: {

    /** LIFE CIRCLE FUNC */

    initEditor () {
      const { value } = this.innerOptions

      value && this.setValue(value)
    },

    /** LOGIC FUNC */

    // TODO 更加精准的同步滚动
    scroll (e, panel) {
      const l = this.$refs['left-panel']
      const r = this.$refs['right-panel']
      // if (!Array.from(e.target.classList).includes(panel)) return null

      const syncScroll = () => {
        if (panel === 'left') {
          const leftRatio = (l.scrollTop / l.scrollHeight).toFixed(2)
          // console.log(+new Date() - this.timer.time)
          // this.timer.time = +new Date()
          r.scrollTop = r.scrollHeight * leftRatio
        } else if (panel === 'right') {
          const rightRatio = (r.scrollTop / r.scrollHeight).toFixed(2)
          // console.log(+new Date() - this.timer.time)
          // this.timer.time = +new Date()
          l.scrollTop = l.scrollHeight * rightRatio
        }
      }

      if (!this.timer.scroll) {
        syncScroll()
        this.timer.scroll = setTimeout(() => {
          this.timer.scroll = null
        }, 17)
      }
      // if (window.requestAnimationFrame) {
      //   window.requestAnimationFrame(syncScroll)
      // } else {
      //   if (!this.timer.scroll) {
      //     syncScroll()
      //     this.timer.scroll = setTimeout(() => {
      //       this.timer.scroll = null
      //     }, 16)
      //   }
      // }
    },

    /** ATOM FUNC */

    setValue (value) {
      this.value = value
    },
    getValue () {
      return this.value
    }
  }
}
</script>

<style lang="scss" scoped>

@import url('./css/basic.scss');
@import url('./css/main-theme.scss');

.t-editor {
  width: 100%;
  height: 100%;

  .left-panel,
  .right-panel {
    flex-basis: 50%;
    padding: 50px;
    height: 100%;
    border: 0;
    line-height: 1.6em;
    color: #3a3a3a;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .panel-gap {
    width: 1px;
    height: 100%;
    background: #e3e3e3;
  }
}

.left-panel {
  background-color: #f5f5f5;
}

</style>

