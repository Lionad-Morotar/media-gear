export const KeyboardListener = {

  data () {
    return {

      // 将监听函数绑定到的DOM
      bindEl: null,

      // 用户在页面上的键盘记录
      keyboardPath: [],

      // 记录同时按下的按键
      keyboardVector: [],

      // 用来存储需要执行检查的按键
      // 若是组合按键，会被拆分成单个按键存入
      sinTriggerKeyStore: {},
      // 用来储存要执行的函数名
      handlerStore: {},
      confStore: {
        type: []
      }

    }
  },

  computed: {

    canSetVector () {
      return this.confStore.type.includes('set-vector')
    }

  },

  created () {

  },
  beforeDestroy () {
    if (this.bindEl) {
      this.bindEl.removeEventListener('keydown', this.$_keyboardListener)
      this.bindEl.addEventListener('keyup', this.$_clearVector)
    }
  },
  methods: {

    // 初始化
    // ! 暂不可绑定到非'body'元素
    // 将监听函数绑定到DOM(默认为'body')
    $_initKeyBoardListenerEvent (el) {
      let findEl = document.querySelector(el || 'body')
      if (findEl) {
        this.bindEl = findEl
        this.bindEl.addEventListener('keydown', this.$_keyboardListener)
        this.bindEl.addEventListener('keyup', this.$_clearVector)
      }
    },

    $_keyboardListener (e) {
      // console.log(e)
      let pushIn = (type = ['path', 'vector']) => {
        if (
          // vector长度为0强制存入
          this.keyboardVector.length === 0 ||
          // 相同的按键只存一次结果
          this.keyboardPath[this.keyboardPath.length - 1] !== e.key
        ) {
          type.includes('path') && this.keyboardPath.push(e.key)
          type.includes('vector') && this.keyboardVector.push(e.key)
        }
      }

      if (this.canSetVector) {
        pushIn()
      }

      // check trigger
      if (this.$_checkKeyIsTrigger(e.key)) {
        pushIn()
        let combined = this.toLowerCase(this.keyboardVector.join('+'))
        // console.log(combined, this.keyboardVector)
        if (this.handlerStore[combined]) {
          // e.preventDefault()
          this.handlerStore[combined]()
          const eventHub = this.confStore.store || this.$root.eventHub
          eventHub &&
            eventHub.$emit(`${this.pagePrefix || 'KeyBoardListener::'}${e.key}`)
        }
      }
    },

    $_clearVector (e) {
      if (this.$_checkKeyIsTrigger(e.key) || this.canSetVector) {
        this.keyboardVector.shift()
        // e.preventDefault()
      }
    },

    $_setTriggerKey (conf = {}, keys = []) {
      this.$_initKeyBoardListenerEvent(conf.el)
      this.confStore = conf

      // set key store
      let checkKey = '+'
      keys.map(o => {
        let handle = o.key.split(checkKey)
        let isCombined = handle.length > 1
        // single key store
        isCombined && o.key !== checkKey
          ? handle.map(key => {
            this.sinTriggerKeyStore[this.toLowerCase(key)] = true
          })
          : this.sinTriggerKeyStore[this.toLowerCase(o.key)] = true
        // handler store
        this.handlerStore[this.toLowerCase(o.key)] = o.handler
      })
      // console.log(this.sinTriggerKeyStore, this.handlerStore)
    },

    /** Calculation Function */

    $_checkKeyIsTrigger (key) {
      return this.sinTriggerKeyStore[this.toLowerCase(key)]
    },

    toLowerCase (char) {
      return char.replace(/[A-Z]/g, (match) => {
        return match.toLowerCase()
      })
    }

  }

}
