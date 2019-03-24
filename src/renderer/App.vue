<template>
  <div id="app">

    <div id="electron-titlebar" class="inset" style="z-index: 1; ">
      <div class="drag" id="drag-left"></div>
      <div class="drag" id="drag-right"></div>
    </div>

    <!-- app -->
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
          this.$store.dispatch('toggleHelperActive')
        }
      },
      {
        key: 'Escape',
        handler: () => {
          this.$store.dispatch('inActiveHelper')
        }
      }
    ])
  },

  methods: {

    closeHelper () {
      this.visible.helper = false
    }

  }
}
</script>

<style lang="scss">
#app {
  display: block;
}
</style>
