<template>
  <div :id="id" />
</template>

<script>

import Editor from 'tui-editor'

import 'codemirror/lib/codemirror.css'
import 'tui-editor/dist/tui-editor.css'
import 'tui-editor/dist/tui-editor-contents.css'

import defaultOptions from './defaultOptions'

export default {
  name: 'markdown-editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default () {
        return 'markdown-editor-' + this.$utils.getRandomNumber()
      }
    },
    options: {
      type: Object,
      default () {
        return defaultOptions
      }
    },
    mode: {
      type: String,
      default: 'markdown'
    },
    height: {
      type: String,
      required: false,
      default: '300px'
    }
  },
  data () {
    return {
      editor: null
    }
  },

  computed: {
    editorOptions () {
      const options = Object.assign({}, defaultOptions, this.options)
      options.initialEditType = this.mode
      options.height = this.height

      return options
    }
  },
  watch: {
    value (newValue, preValue) {
      // && newValue !== this.editor.getValue()
      if (newValue !== preValue) {
        this.editor.setValue(newValue)
      }
    },
    height (newValue) {
      this.editor.height(newValue)
    },
    mode (newValue) {
      this.editor.changeMode(newValue)
    }
  },

  mounted () {
    this.initEditor()
  },
  destroyed () {
    this.destroyEditor()
  },

  methods: {

    initEditor () {
      this.editor = new Editor({
        el: document.getElementById(this.id),
        ...this.editorOptions
      })
      if (this.value) {
        this.editor.setValue(this.value)
      }
      // this.editor.on('change', () => {
      //   this.$emit('input', this.editor.getValue())
      // })
      // this.editor.off('change')
    },
    destroyEditor () {
      if (this.editor) {
        this.editor.remove()
      }
    },

    setValue (value) {
      this.editor.setValue(value)
    },
    getValue () {
      return this.editor.getValue()
    },
    setHtml (value) {
      this.editor.setHtml(value)
    },
    getHtml () {
      return this.editor.getHtml()
    }
  }
}
</script>
