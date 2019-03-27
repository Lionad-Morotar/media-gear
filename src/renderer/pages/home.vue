<template>
  <div class="home-page max">

    <mdEditor :options="{ value: content }" />

  </div>
</template>

<script>

import mdEditor from './components/mdEditor'

export default {
  name: 'markdown-demo',
  components: { mdEditor },
  data () {
    return {
      content: `# Lionad's Editor

Hello, everyone, my name is t-editor!

### header
##### header 5
###### header 6

### list
* list 1
* list 2
* list 3

### code
And I can display \`code\` for you ~

### blockquote
> I am a blockquote
`
    }
  }
}
</script>

<style scoped>
</style>
