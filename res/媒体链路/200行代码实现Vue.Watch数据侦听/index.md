# 🚀150行代码带你实现Vue.Watch数据侦听

## 前言

在Vue项目中, 我们经常使用到`Vue.$watch`去侦听一个数据是否发生变化, 如果发生变化则执行相应的回调函数. 在今天这篇文章中, 我将手把手带你打造一个侦听器, 它可以这样使用:

```JS
// 一个快速赋值的语法糖函数, 可以创建形如 { value: a { b: { val: ''} } } 的对象
vx.set('value.a.d', { val: '' })
// 对某个属性进行侦听, 如果发生改变, 则执行相应函数(可多次watch以执行多个函数)
vx.watch('value.a.d.val', newVal => {
  console.log(`val改变为 : `, newVal)
})
```

坐稳了, 三轮车准备启动了~ 各位评论见~ 😋

## 稍微理一理思路

在我们的小程序中, 使用到一个全局对象作为一些各个页面通用数据的存储, 一开始我的想法很简单, 我想做一个可以侦听这个全局对象某个属性的侦听器, 只要满足**简单**和**响应式**这两个条件就好.

那么先做数据结构的预估, 既然想要达到对属性侦听执行回调的功能, 那么:

1. 肯定会涉及到getter/setter里触发回调函数这个操作
2. 可能需要设置一个列表, 用于存放回调函数
3. 列表会在属性的setter里被遍历, 触发其中所有回调函数

## Dep.js

我们先造一个通用的**依赖对象**, 它自带一个数组用于存放回调函数, 同时具有添加删除函数, 清空数组, 执行数组内函数等方法:

```JS
class Dep {
  constructor () {
    this.subs = []
  }
  addSub (fn) { /*...*/ }
  delSub (fn) { /*...*/ }
  // 将回调添加到依赖数组中
  collect (fn = watcher) {
    if (fn && !this.subs.find(x => x === fn)) {
      this.addSub(fn)
    }
  }
  // 执行依赖数组中每一个函数
  notify (newVal, oldVal) {
    this.subs.forEach(func => func(newVal, oldVal))
  }
}
```

在`collect`函数中, 我们对`fn`方法进行了判断不重复然后添加到`subs`中这样一个操作, 可以看到他的默认值是`fn = watcher`, 这里稍后解释~

## defineProperty

### 过一遍定义

可能是因为接触DefineProperty要比接触Proxy早一些, 这边代码使用了前者进行实现, 这里快速过一遍`defineProperty`具体配置:

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

### 结合Dep.js

显而易见, 我们只需要加上两句就可以完成这部分逻辑:

```diff
+ const dep = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      return val
    },
    set: newVal => {
      val = newVal
+     dep.notify(newVal, val)
    }
  })
```

此后每当对应属性进行更新操作, 那么就会执行依赖数组中的回调函数.

不过这样还不够, 我们还得想办法获取到这个dep实例, 才能给它的依赖数组填充函数.

这边提供一个很简单的思路:

```diff
+ set (key, val, obj) {
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: () => {
        return val
      },
      set: newVal => {
        val = newVal
        dep.notify(newVal, val)
      }
    })
+   return dep
+ }
```

将`defineProperty`封装成一个函数调用, 最后返回这个`dep`实例, 这样的话我们可以在实际业务中这样去使用:

```JS
const valueDep = set('value', b, {})
valueDep.addSub(() => { console.log('value changed!') })
```

虽然代码能使用了, 但是看起来哪里怪怪的?
不过至少目前为止, 我们想要的**简单**, **响应式**两个功能都完成了, 三轮车熄火~

## 新构思

<黑客与画家>一书中曾经提到这样一个观点, 我深有体会:

> 如果你觉得你的代码奇怪, 那么往往它的实现是错的

上面的那一串代码仅仅是能跑通的水平, 我们需要加入更多的细节和思考, 有时候只需要坐下来稍微看一下代码, 就会有各种想法蹦出来:

> 构思这种东西有一个特点，那就是它会导致更多的构思。你有没有注意过，坐下来写东西的时候，一半的构思是写作时产生的？

(喝口水我们继续)

## 隐藏Dep

我希望在使用这个侦听器的时候:

1. 不需要将全局对象显式传递进去
2. 不要显式调用任何`Dep.js`定义的函数

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