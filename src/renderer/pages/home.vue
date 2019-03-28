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
      content: (`# TEditor

你好, 我是使用状态机实现的超轻量Markdown预览工具, 名字叫做\`TEditor\`~

### 功能 : Header
##### Header 5
##### Header with \`word\`

### 功能 : Unsorted List
* list 1 +plus+ or -minus-
* list 2
* list 3

### 功能 : Word
And \`Then\` Thank U \`For\` \`Watching\` ~

### 功能 : Block Quote
> ### 可以使用 Header with \`word\` +plus+ or -minus-
>  也可以使用词块\`Word in block\`
> 或者是列表:
> * 1 +plus+ or -minus-
> * 2
> * 3`)
    }
  }
}
</script>

<style scoped>
</style>
