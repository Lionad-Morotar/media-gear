<template>
  <div class="home-page max">

    <window fullbody>
      <mdEditor :options="{ value: content }" />
    </window>

  </div>
</template>

<script>

import Window from './components/window/window'
import mdEditor from './components/mdEditor'
import mdExample from './components/mdEditor/demo.md.js'

export default {
  name: 'markdown-demo',
  components: {
    Window,
    mdEditor
  },
  data () {
    return {
      content: mdExample
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
