<template>
  <transition name="fade">
    <div id="helper-cmpt" class="fcc" v-show="visible">

      <input
        ref="helper-input"
        class="helper-input br6"
        type="text"
        autofocus
        v-model="search"
      />

    </div>
  </transition>
</template>

<script>

export default {
  name: 'helper-cmpt',
  props: {
    visible: Boolean
  },
  data () {
    return {
      search: ''
    }
  },
  watch: {
    visible (n, o) {
      if (n) {
        // TODO
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#helper-cmpt {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,.25);
}
.helper-input {
  width: 30vw;
  min-width: 350px;
  height: 50px;
}
</style>