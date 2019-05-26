# 📝你本可以少写一些if-else

> 写代码原本是一件很快乐的事情, 大家一起高高兴兴的搬砖, 啥事儿都没有. 问题出在每个人的代码标准和审美都不同, 甚至代码业界也充斥着各种不同的代码标准以及"最佳实践", 这下事儿大了.

## 前言

我不喜欢业务代码航天飞机式`if/else`语句, 它复杂而臃肿, 至少从美感而言, 我觉得`switch`就比`if/else`优雅很多. 如果跨语言比较的话, 私以为ReasonML的模式匹配比起寻常的`switch`语句又要强上太多. 不同写法带来的感觉是很不同的, 在这篇文章, 我将介绍一些用于替代普遍场景中if/else的写法. 只有熟悉更多种代码模式, 才能开阔我们的思维, **如果没有更深入地了解代码特征, 去学习代码更多可能性, 也许我们就成了被代码控制住的人**.

> "他觉得Blub语言已经够用了, 这时, 他的思维就已经被语言同化了" —— Paul Graham <黑客与画家>

希望本文能给大家带来一些代码上的遐想及思考, 如有不当之处, 欢迎各位指出及补充. 如果你想阅读更多有关业务代码中复杂判断逻辑的写法, 文末整合了一些我参考的文章(可以收藏再慢慢看(暗示收藏)), 也许能给你带来更多思路.

### if/else

我们先以一个售后流程举例. 用户购买商品后, 可能会发现错件漏件/质量问题/描述不符等原因想联系商家进行售后服务, 其中涉及到退款/退货/换货/补发等售后支持服务, 同时用户会对不同原因导致的售后问题以及店家对此次售后的态度产生不同的态度. 我们假设以下代码:

```js
/* 商家售卖商品给买家购买 */
const goods = {
  AlphaStrike: { name: 'A', price: 1, des: '-10HP' },
  ...otherGoods
}
store.setOnSale(goods)

/* 定义进行售后的各种原因 */
user.purchace(['A'])
store.mail(something)
const state_MissingPart = checkState(user.receive([]))  //错件漏件
const state_BadQuality = checkState(user.receive([{ name: 'ā', des: '-9HP' }])) // 质量问题
const states = [state_MissingPart, state_BadQuality, ...otherStates]

/* 买家根据不同的售后原因, 去获取不同的售后支持 */
const serviceReason = random(states)
if (serviceReason === '错件漏件') {
  const action = user.getService(random(['退款', '补发']))

  if (action === '退款') {
    if (store.checked) {
      store.refund(somemoney)
      user.love(1)    // 用户更喜欢这家店了
    } else {
      user.love(-1)   // 用户更讨厌在这买东西了
    }
  } else if (action === '补发') {
    if (store.checked) {
      store.mail(goods.AlphaStrike)
      user.love(2)
    } else {
      user.love(-2)
    }
  }
} else if (serviceReason === '质量问题') {
  const action = user.getService(random(['退款', '退货', '换货']))

  if (action === '退款') {
    if (store.checked) {
      store.refund(somemoney)
      user.love(3)
    } else {
      user.love(-3)
    }
  } else if (action === '退货') {
    if (store.checked) {
      user.mail(recievedGoods)
      store.refund(somemoney)
      user.love(4)
    } else {
      user.love(-4)
    }
  } else if (action === '换货') {
    if (store.checked) {
      user.mail(recievedGoods)
      store.mail(goods.AlphaStrike)
      user.love(5)
    } else {
      user.love(-5)
    }
  }
} else // ... handle 描述不符 / 非质量原因退货 等各种状况

```

显然,  在这种逻辑稍重的地方if/else显得力不从心, 我认为原因主要是:

1. elseif语句条件后置, 也就是在`} else if (serviceReason === '质量问题') {`一行, 我们通常要在行末才能找到if条件成立的原因, 而这经常与下一行的代码混在一起, 让人无法辨识, 这种情况在编辑器某些代码高亮不合理的主题中尤为严重.
2. if/else代码块下固定的缩进给人不清晰的感觉, 如果花括号中的内容很长, 那么阅读代码的时候, 寻找if语句对应花括号的结束位置也会给人带来负担. 如果内容很短, 就像`else { user.love(-5 }`占用了3行的位置显得过于奢侈.

### 三目运算符/短路表达式

针对奢侈换行的问题, 在一些简单的表达式中, 我们经常使用到单行判断, 如:

```js
// 三目运算符
user.love(store.checked ? 5 : -5)

// 短路表达式
store.checked && store.refund(somemoney)
```

通过括号和逗号运算符, 我们能把语句转化为表达式, 以使三目或短路支持一些更复杂的情况. 前提是你喜欢这种写法:

```js
if (action === '换货') {
  store.checked && (
    user.mail(recievedGoods),
    store.mail(goods.AlphaStrike)
  )
  user.love(store.checked ? 5 : -5)
}
```

### switch/case

在处理多分支任务中, 很多人会选择使用switch作为长if/else的替代品:

```js
/* 买家根据不同的售后原因, 去获取不同的售后支持 */
switch (serviceReason) {
  case '错件漏件':
    const action = user.getService(random(['退款', '补发']))
    switch (action) {
      case '退款':
        store.checked && store.refund(somemoney)
        user.love(store.checked ? 1 : -1)
        break
      case '补发':
        store.checked && store.mail(goods.AlphaStrike)
        user.love(store.checked ? 2 : -2)
        break
    }
    break
  case '质量问题':
    const action = user.getService(random(['退款', '退货', '换货']))
    switch (action) {
      case '退款':
        store.checked && store.refund(somemoney)
        user.love(store.checked ? 3 : -3)
        break
      case '退货':
        store.checked && (
          user.mail(recievedGoods),
          store.refund(somemoney)
        )
        user.love(store.checked ? 4 : -4)
        break
      case '退货':
        store.checked && (
          user.mail(recievedGoods),
          store.mail(goods.AlphaStrike)
        )
        user.love(store.checked ? 5 : -5)
        break
    }
    break
}
```

无论是可读性或者是代码长度, 看起来switch语句并没有比if/else要好多少. 不过有一点我要提及的是, 在上面这个例子中, 所有有关判断的关键字(如switch, case, &&)等高亮的地方, 几乎都在每一行开头的前两个语元内, 就找起判断元素的困难程度而言, switch是要比if/else好上一些的(尽管这种好处会随着判断的增加而逐渐被消磨殆尽)

switch还有一个令我觉得遗憾的地方, 它不能和短路运算符一并使用, 下面是一种错误的示范:

```js
switch (serviceReason) {
  case '质量问题':
    const action = user.getService(random(['退款', '退货', '换货']))

    store.checked && switch (action) { // 这是不合法的写法
      case '退款': // ...
      case '退货': // ...
      case '退货': // ...
    }
}
```

我们再来看一种配置数据与业务逻辑分离(下简称配置逻辑分离)的思路.

### 配置数据与业务逻辑分离

配置逻辑分离没有先决条件, 和三目短路表达式一样, 你随时都可以开始在代码中使用它. 使用配置逻辑分离, 我们需要定义一个`flag`作为配置的名称, 配置的值则可以是函数, 数组等任意类型的值:

```js
// 业务数据配置
const serviceHandler = {
  '错件漏件': {
    '退款': () => (store.checked && store.refund(somemoney), 1),
    '补发': () => (store.checked && store.mail(goods.AlphaStrike), 2)
  },
  '质量问题': {
    '退款': () => (store.checked && store.refund(somemoney), 3),
    '退货': () => (store.checked && (user.mail(recievedGoods), store.refund(somemoney)), 4)
    '退货': () => (store.checked && (user.mail(recievedGoods), store.mail(goods.AlphaStrike)), 5)
  }
}
// 业务逻辑执行
const handler = serviceHandler[serviceReason] || {} // 对搜寻结果进行'兜底'
const executor = handler[random(Object.keys(handler))] || _ => _
const loveScore = executor() || 0
user.love(store.checked ? loveScore : -loveScore)
```

有没有眼前一亮的感觉呢? (暗示点赞.jpg)

在上面的片段中, 我们将每一种状态的数据配置和执行业务逻辑的代码进行了一定层度的分离, 使得代码长度短了不少. 通过逗号运算符, 我们可以同时执行业务逻辑函数, 并且返回用户态度分数. 不过也许我们不应该那么激进, 保险起见也许你也可以这样写:

```js
const serviceHandler = {
  '错件漏件': {
    '退款': () => ({ score: 1, cb: () => store.refund(somemoney) }),
    '补发': () => ({ score: 2, cb: () => store.mail(goods.AlphaStrike) })
  },
  '质量问题': {
    '退款': () => ({ score: 3, cb: () => store.refund(somemoney) }),
    '退货': () => ({ score: 4, cb: () => (user.mail(recievedGoods), store.refund(somemoney) }),
    '退货': () => ({ score: 5, cb: () => (user.mail(recievedGoods), store.mail(goods.AlphaStrike)) })
  }
}
const handler = serviceHandler[serviceReason] || {}
const executor = handler[random(Object.keys(handler))] || _ => _
const handleRes = executor(), handleRes.cb()
user.love(store.checked ? handleRes.score : -handleRes.score)
```

### 更灵活的数据配置

不过使用对象进行数据配置, 也有一点我觉得遗憾, 那就是尽管属性的值可以为任意类型, 但是属性本身却只能是字符串, 这使得某些场景下我们不能很好的发挥配置逻辑分离的作用. 请想象以下场景: 每个月末, 商家会挑选出狂热粉丝(喜爱程度分数大于等于100)发送留言"感谢你"并赠送10元优惠券, 普通粉丝(分数0-100)只发送留言"感谢", 黑粉(分数小于0)则发送"抱歉"并赠送10元优惠券.

等等, 喜爱程度分数可以大于100! 显然我们不能用对象去处理这样的数据:

```js
const scoreMap = {
  '0' () {
    sendMsg('thanks')
  },
  // ...
  '99' () {
    sendMsg('thanks')
  },
  '100' () {
    sendMsg('thank u')
    sendCoupon(10)
  }
}
```

令人头大, 难到我们要用回if/else? 坏消息是, 在这种情况下也许是时候用回if/else了.

不过, 我必须说明一点, 当条件足够复杂时——比如商家不仅赠送优惠券, 商家根据粉丝分数高低不同, 可能送QQ红钻/绿钻/黄钻/...等一堆需要判断的礼品——使用if/else依旧会面临我们在第一小节提到的代码混乱等问题. 所以好消息是, 使用配置逻辑分离能够处理这种混乱的场景(而且它比较擅长). 你还记得我们刚刚提到的"属性本身却只能是字符串"这种遗憾吗? 现在我们就是要解决这个问题! 请看以下代码:

```js
// 使用Map进行数据配置
const scoreHandler = new Map([
  [/^score_-[0-9]{1,2}$/, () => (sendGift(['绿钻','蓝钻','红钻','黄钻','紫钻']))],
  [/^score_1[0-9]{1}$/, () => (sendGift('蓝钻'))],
  [/^score_2[0-9]{1}$/, () => (sendGift('红钻'))],
  [/^score_3[0-9]{1}$/, () => (sendGift('黄钻'))],
  [/^score_4[0-9]{1}$/, () => (sendGift('紫钻'))],
  [/^score_5[0-9]{1}$/, () => (sendGift('紫钻'))],
  [/^score_6[0-9]{1}$/, () => (sendGift('紫钻'))],
])

const userScore = 15
const validScore = `score_${userScore}`
let handle, entriess = scoreHandler.entries()
while ({ value: handle, done } = entriess.next(), !done) {
  const [scoreReg, handler] = handle
  if (scoreReg.test(validScore)) {
    handler() // 输出结果 "蓝钻"
    entriess = { next: () => ({ value: null, done: true }) } // 终止循环
  }
}
```

使用Map进行数据配置是我觉得非常棒的一种写法, 如果你必须兼容IE浏览器的话, 也许你也可以考虑以下方式:

```js
// 双数组进行数据配置
const validator = [
  [/^score_-[0-9]{1,2}$/],
  [/^score_1[0-9]{1}$/],
  [/^score_2[0-9]{1}$/],
]
const handler = [
  () => (sendGift(['绿钻','蓝钻','红钻','黄钻','紫钻'])),
  () => (sendGift('蓝钻')),
  () => (sendGift('红钻')),
]
// 执行逻辑省略
// 从validator中找到校验通过的元素的下标, 然后执行handler数组中对应下标的回调函数

// ... 或者其它, 各种各样的数据配置方式等你探索 ...
```

我们在两小节(配置数据与业务逻辑分离, 更灵活的数据配置)中提到几种不同的代码风格, 其中任意一种, 都是将'配置'这种概念发挥到领先判断一大步的写法. 在实际业务中, 你也可以试试混合式写法, 主要考量的点可能会在**配置领先判断, 还是判断领先配置**.

## 后语

本文主要介绍了几种用于替代普遍场景中if/else的写法, 如三目+逗号运算符, 使用对象/Map/双数组进行配置数据与业务逻辑分离, 虽然处理业务逻辑的思路是一样的, 但是每种方法写起来的实际感觉却不一样, 孰优孰劣, 还请各位看官仔细品味一番.

最后, 如果本文能给大家带来一些代码上的遐想及思考, 那是再好不过(暗示点赞*2.jpg), 如文中有不当之处, 欢迎各位在评论中指出及补充.

### 代码性能

我没有实际考察过各种写法的性能代价, 有兴趣的掘友可以尝试一下👍

### Refs

- [JavaScript 复杂判断的更优雅写法](https://juejin.im/post/5bdfef86e51d453bf8051bf8)
- [[浅析]特定场景下取代if-else和switch的方案](https://juejin.im/post/5b4b73e7f265da0f96287f0a)
- [[探索]在开发中尽量提高代码的复用性](https://segmentfault.com/a/1190000016604728)
- [MDN: Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)