<template>
  <div id="app">

    <!-- app -->
    <router-view />

    <!-- externals -->
    <helper />

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
