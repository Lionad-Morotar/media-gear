<template>
  <div id="madros">
    <noscript>You need to enable the fucrrr~~~ JavaScript to run madros.</noscript>

    <!-- madros -->
    <router-view />

    <!-- externals -->
    <helper />

  </div>
</template>

<script>

import { KeyboardListener } from './mixins/KeyboardListener.mixins.js'

import helper from './views/helper'

export default {
  name: 'mgear-project',
  components: {
    helper
  },
  mixins: [
    KeyboardListener
  ],

  data () {
    return {
      // ...
    }
  },
  computed: {
    active () {
      return this.$store.getters.helperActive
    }
  },

  created () {
    this.startOS()
    this.$_setTriggerKey({
      type: [
        'intercept-all',
        'set-vector'
      ]
    }, [
      {
        key: 'F1',
        handler: () => {
          this.$store.dispatch('toggleHelperActive')
        }
      },
      {
        key: 'Escape',
        handler: () => {
          this.$store.dispatch('deActiveHelper')
        }
      }
    ])
  },

  methods: {

    // 启动时应该针对 persistedState 做一些处理
    startOS () {
      this.$store.dispatch('flushMadrosWindows')
    },

    closeHelper () {
      this.visible.helper = false
    }

  }
}
</script>

<style lang="scss">
#madros {
  display: block;
  font-size: 14px;
  overflow: hidden;
  cursor: normal;
}
</style>
