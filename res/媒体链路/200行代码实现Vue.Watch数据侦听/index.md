# 🚀150行代码带你实现小程序中的数据侦听

## 前言

在小程序项目中, 我们的通常会使用到使用到一个全局对象作为各个页面通用的数据存储容器, 将它绑定到app对象后, 就能在每一个页面都自由的操纵这个对象. 然而在实践中, 由于这个对象及其属性不具备响应式条件, 它不能直接参与业务逻辑的编写, 能力仅仅局限于数据储存. 若是在VueJS项目中, 我们可能经常使用到`Vue.$watch`去侦听某个数据是否发生变化, 小程序却缺乏这种能力.

在这篇文章中, 我将用150行代码, 手把手带你打造一个小程序也可以使用的侦听器VX:

```JS
// 一个快速赋值的语法糖函数, 可以创建结构为 { value: a { b: { val: ''} } } 的对象
vx.set('value.a.d', { val: '' })
// 对某个属性进行侦听, 如果发生改变, 则执行相应函数(可多次watch以执行多个函数)
vx.watch('value.a.d.val', newVal => {
  console.log(`val改变为 : `, newVal)
})
value.a.d.val = 3 // val改编为 : 3
```

使用VX侦听器, 我们可以更加方便的管理各个页面的状态. 同时, 我们凭借`watch`语法, 可以更优雅地编写业务逻辑.

坐稳了, 三轮车准备启动了~ 各位评论见~ 😋

## 稍微理一理思路

在全局对象中, 我们不一定要对每一个属性都进行侦听, 所以VX主要的功能就是通过set去设置某个具体属性的setter/getter, 同时通过watch向添加该属性添加需要订阅的回调函数.

## 依赖对象的实现

首先我们需要造一个通用的**依赖对象**, 依赖对象携带一个订阅数组用于存放一组回调函数, 同时它还应该包括一些操作订阅数组能力(如添加订阅, 清空订阅)的函数

```JS
class Dep {
  constructor () {
    this.subs = []
  }
  addSub (fn) { /*...*/ }
  delSub (fn) { /*...*/ }
  // 将回调添加到数组中
  collect (fn) {
    if (fn && !this.subs.find(x => x === fn)) {
      this.addSub(fn)
    }
  }
  // 执行数组中每一项函数
  notify (newVal, oldVal) {
    this.subs.forEach(func => func(newVal, oldVal))
  }
}
```

全局对象中每一个响应式属性(及其每一个子属性), 都应该和一个新的Dep实例保持一一对应的关系, 这样我们进行侦听变化, 执行订阅的回调函数时, 只需要找到对应的实例执行`notify`通知更新即可.

## 设置响应式属性

### defineProperty

可能是因为接触DefineProperty要比接触Proxy早一些的缘故, 代码使用了前者进行响应式的实现, Object.defineProperty方法会直接在一个对象上定义一个新属性, 这里快速过一遍`defineProperty`具体配置:

```JS
// @param obj 要在其上定义属性的对象
// @param key 要定义或修改的属性的名称
Object.defineProperty(obj, key, {
  // 该属性是否能被枚举
  enumerable: true,
  // 该属性能否被删除
  configurable: true,
  // 访问该属性则会执行此方法
  get: () => {
    return val
  },
  // 修改该属性时会执行此方法
  set: newVal => {
    val = newVal
  },
  // value & writeble 不能和 getter/setter 同时出现
})
```

通过对defineProperty进行上层封装, 我们可以轻松的实现在全局对象上设置响应式属性功能, 在此, 我们结合刚才定义的Dep对象, 将一个新的dep实例绑定到新增属性的setter中:

```JS
set (key, val, options = {}, obj = this.store) {
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      return val
    },
    set: newVal => {
      if (newVal === val) {
        return
      }
      dep.notify(newVal, val)
      val = newVal
    }
  })
}
```

每当对应属性被赋值, 就会执行依赖数组中的回调函数.

不过这样还不够, 我们还得想办法获取到这个dep实例, 才能给它的依赖数组填充函数.

这边提供一个很简单的思路, 并不推荐实践中这么做:

```diff
set (key, val, options = {}, obj = this.store) {
  const dep = new Dep()
  Object.defineProperty(obj, key, {})
+ return dep
}
```

```JS
const valueDep = set('value', b, {})
valueDep.addSub(() => { console.log('value changed!') })
```

虽然代码能使用了, 就是是看起来怪怪的~ 😋 我们的三轮车开进了岔路~

## 通过watch添加订阅

### 喝口水我们继续

<黑客与画家>一书中曾经提到这样一个观点, 我深有体会:

> 如果你觉得你的代码奇怪, 那么往往它是错的

上面的那一串代码仅仅是能跑通的水平, 我们需要加入更多的细节和思考, 有时候只需要坐下来稍微看一下代码, 就会有各种想法蹦出来:

> 构思这种东西有一个特点，那就是它会导致更多的构思。你有没有注意过，坐下来写东西的时候，一半的构思是写作时产生的？

## 隐藏Dep


这些内容应和外部是解耦的. 首先一点, 我们创建一个侦听器类, 用于封装我们侦听所用到的所有方法, 同时, 它内含一个对象作为页面状态储存的容器

```JS
class VX {
  constructor () {
    this.store = createStore()
  }
  watch (key, fn, obj) {}
  set (key, val, obj) {}
}

function createStore () {
  const newStore = Object.create(null)
  return newStore
}
```

我们的VX对象, 

为了实现这一点, 我们仿照VueJS中思路, 使用一个全局的对象

## 后语


## 项目地址

> [Github直达](https://github.com/Lionad-Morotar/media-gear/blob/master/src/renderer/utils/suites/vx/index.js)