<template>
  <div class="components-container">

    <mdEditor v-model="content" />

  </div>
</template>

<script>
import mdEditor from './components/mdEditor'
const content = `
**This is test**
* vue
* element
* webpack
`
export default {
  name: 'MarkdownDemo',
  components: { mdEditor },
  data () {
    return {
      content
    }
  }
}
</script>

<style scoped>
</style>
