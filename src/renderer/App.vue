<template>
  <div id="app">

    <!-- app -->
    <router-view />

    <!-- externals -->
    <helper :visible="visible.helper" />

  </div>
</template>

<script>

import { KeyboardListener } from './mixins/KeyboardListener.mixins.js'

import Helper from './views/Helper'

export default {
  name: 'mgear-project',
  components: {
    Helper
  },
  mixins: [
    KeyboardListener
  ],

  data () {
    return {
      visible: {
        // 将 Helper 的状态转移至 store 中维护
        helper: false
      }
    }
  },

  created () {
    this.$_setTriggerKey({
      type: [
        'intercept-all',
        'set-vector'
      ],
      store: {
        eventHub: this.$root.eventHub
      }
    }, [
      {
        key: 'F1',
        handler: () => {
          this.visible.helper = !this.visible.helper
        }
      },
      {
        key: 'Escape',
        handler: () => {
          this.visible.helper = false
        }
      }
    ])
  }
}
</script>

<style lang="scss">
#app {
  display: block;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .15s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
