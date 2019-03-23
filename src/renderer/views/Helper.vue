<template>
  <transition name="fade">
    <div
      id="helper-cmpt"
      class="fcc"
      v-show="active"
      @click="closeHelper"
    >

      <input
        ref="helper-input"
        class="helper-input"
        type="text"
        v-model="search"
      />

    </div>
  </transition>
</template>

<script>

export default {
  name: 'helper-cmpt',
  data () {
    return {
      search: ''
    }
  },
  computed: {
    active () {
      return this.$store.getters.helperActive
    }
  },
  watch: {
    /** Input 自动聚焦
     * 节点开启关闭时, autofocus 属性不生效
     * 这里使用DOM函数Focus达到自动聚焦的功能
     */
    active (n, o) {
      if (n) {
        this.$nextTick(() => {
          this.$refs['helper-input'].focus()
        })
      }
    }
  },
  methods: {

    closeHelper () {
      this.$store.dispatch('inActiveHelper')
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
  padding: 0 .5em;
  width: 30vw;
  min-width: 400px;
  height: 60px;
  line-height: 60px;
  border-radius: 10px;
  border: solid 1px #999;
  box-shadow: none;
  outline: none;
  font-size: 30px;
  transition: border .1s;

  &:focus {
    border-color: #85b7d9;
    color: rgba(0,0,0,.8);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all .15s;
}
.fade-enter,
.fade-leave-to {
  transform: translateY(5vh);
  opacity: 0;
}
</style>
