<template>
  <div class="home-page max">

    <template v-for="window in windows">
      <window :win="window">
        <components :is="window.is" :data="{ toParsed: content }" />
      </window>
    </template>

  </div>
</template>

<script>

import Window from './components/window/window'

// TODO app 做成页面用router加载 比组件的形式好, 动态组件不适合做这玩意儿
import playground from './apps/playground'
import mdEditor from './apps/mdEditor'
import mdExample from './apps/mdEditor/demo.md.js'

export default {
  name: 'home-page',
  components: {
    Window,
    mdEditor,
    playground
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
          // fullScreenInBody: true,
          // minimized: true,
          top: 50
        }
      }).then(newWin => {
        this.$store.dispatch('activeMadrosWindow', newWin)
      })
    }
    if (!this.windows.find(x => x.is === 'playground')) {
      this.$store.dispatch('createMadrosWindow', {
        config: {
          is: 'playground',
          title: 'PLAY_GROUND',
          top: 70
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
