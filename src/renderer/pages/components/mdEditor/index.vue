<template>
  <div :id="id" class="t-editor">

    <div class="wrapper fss max">
      <textarea
        class="left-panel"
        v-model="value"
      />
      <div class="panel-gap"></div>
      <div class="right-panel">
        <div v-html="parsedValue" />
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
      parsedValue: ''
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
      // TODO bounding
      this.parsedValue = parse(n)
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

.t-editor {
  width: 100%;
  height: 100%;

  .left-panel,
  .right-panel {
    flex-basis: 50%;
    padding: 50px;
    height: 100%;
    border: 0;
    color: #3a3a3a;
    line-height: 1.45em;
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

