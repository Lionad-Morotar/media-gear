<template>
  <div class="components-container">

    <mdEditor v-model="content" />

  </div>
</template>

<script>

import mdEditor from './components/mdEditor'

export default {
  name: 'MarkdownDemo',
  components: { mdEditor },
  data () {
    return {
      content: ''
    }
  }
}
</script>

<style scoped>
</style>
