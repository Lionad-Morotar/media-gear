<template>
  <div class="home-page max">

    <template v-if="activeWindow">
      <window :win="activeWindow">
        <components :is="activeWindow.is" :data="{ toParsed: content }" />
      </window>
    </template>

  </div>
</template>

<script>

import Window from './components/window/window'
import mdEditor from './components/mdEditor'
import mdExample from './components/mdEditor/demo.md.js'

export default {
  name: 'home-page',
  components: {
    Window,
    mdEditor
  },
  data () {
    return {
      content: mdExample
    }
  },
  computed: {
    windows () {
      return this.$store.getters.windows
    },
    activeWindow () {
      return this.$store.getters.activeWindow
    }
  },
  mounted () {
    if (!this.windows.find(x => x.is === 'mdEditor')) {
      this.$store.dispatch('createMadrosWindow', {
        config: {
          is: 'mdEditor',
          title: 'TEditor',
          fullbody: true,
          fullScreenInBody: true,
          top: 50
        }
      }).then(newWin => {
        this.$store.dispatch('activeMadrosWindow', newWin)
      })
    }
  }
}
</script>

<style scoped>
.home-page {
  position: relative;
  background: url('../assets/app/cubes.png');
}
</style>
