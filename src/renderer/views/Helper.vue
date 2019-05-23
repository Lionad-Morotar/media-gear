<template>
  <transition name="fade">
    <div
      id="helper"
      class="fcc"
      v-show="active"
      @click="$store.dispatch('deActiveHelper')"
    >

      <div class="helper-content">
        <input
          ref="helper-input"
          class="helper-input"
          type="text"
          v-model="search"
          @input="matchSnippets"
          @keyup.enter="handleSearch"
          @click.stop
        />
        <div class="matchs-con fss-c">
          <template v-for="match, idx in store.matchs">
            <div class="match-item" :class="[idx === 0 && 'selected']">{{match}}</div>
          </template>
        </div>
      </div>

    </div>
  </transition>
</template>

<script>
import installInfo from './../pages/apps/installed-info'

export default {
  name: 'helper',
  data () {
    return {
      store: {
        apps: [...installInfo],
        matchs: []
      }
    }
  },
  computed: {
    active () {
      const val = this.$store.getters.helperActive
      /** Input 自动聚焦
       * 节点开启关闭时, autofocus 属性不生效
       * 这里使用DOM函数Focus达到自动聚焦的功能
       */
      val && this.$nextTick(() => {
        this.$refs['helper-input'].focus()
      })
      return val
    },
    search: {
      get () {
        return this.$store.getters.helperSearchContent
      },
      set (val) {
        this.$store.dispatch('changeSearchContent', { val })
      }
    }
  },
  methods: {
    matchSnippets () {
      const search = this.search
      const apps = this.store.apps.filter(([app, val]) => search.match(app))

      // console.log(apps, apps.map(([app, val]) => val.config.title))
      this.store.matchs = apps.map(([app, val]) => val.config.title)
    },
    handleSearch () {
      const search = this.search

      switch (search) {
        default:
          const apps = this.store.apps.filter(([app, val]) => app.test(search))

          apps.map(([app, val], idx) => {
            const multyWindow = val.info.multyWindow
            const config = Object.assign(val.config, {
              is: search,
              title: search
            })
            const findExistWindow = this.$store.getters.windows.filter(win => app.test(win.is)).length

            if (!findExistWindow || (findExistWindow && multyWindow)) {
              this.$store.dispatch('createMadrosWindow', { config }).then(newWin => {
                if (idx === apps.length - 1) {
                  this.$store.dispatch('activeMadrosWindow', newWin)
                }
              })
            }
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#helper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,.25);
  z-index: 999;
}
.helper-content {
  position: relative;
  top: -10vh;
}
.helper-input {
  padding: 0 .5em;
  width: 30vw;
  min-width: 400px;
  height: 60px;
  line-height: 60px;
  border: solid 1px #999;
  font-size: 30px;
  transition: border .1s;

  &:focus {
    border-color: #85b7d9;
    color: rgba(0,0,0,.8);
  }
}

.matchs-con {
  position: absolute;
  left: 0;
  width: 100%;
  border: solid 1px #999;

  .match-item {
    padding: 0 17px;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background-color: white;
    color: #333;
    font-size: 24px;
    transition: .1s;

    &.selected {
      background-color: #f9f9f9;
    }
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
