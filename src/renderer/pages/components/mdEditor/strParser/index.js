/** 将字符串解析为Markdonw格式的HTML的状态机实现
 * @author: Lionad <tangnad@qq.com>
 */

/* eslint-disable */

/** 节点权重 */

const PBI = 1000 // POINT_BLOCK_ITEM
const PLI = 100 // POINT_LINE_ITEM
const PILBI = 10 // POINT_INLINE_BLOCK_ITEM
const point = {
  blockquote: PBI,
  div: PBI,
  hr: 999,
  h: PLI,
  h1: PLI,
  h2: PLI,
  h3: PLI,
  h4: PLI,
  h5: PLI,
  h6: PLI,
  li: 11,
  p: PILBI,
  code: PILBI,
  sup: PILBI,
  sub: PILBI,
  span: 1,
  null: 0
}

/** 特殊状态元素 */

const blockElement = ['blockquote']
const inlineBlockElement = ['p', 'code', 'sup', 'sub']
const canLeverUpElement = ['h']
const canLeverUpEleInitStateReflex = {
  h: 1
}
const leverUpHandler = {
  h: num => num < 6 ? num + 1 : 6
}

/** 状态机 state machine */

let lines = 1
let flag = null
let flagRec = []
let lerverUp = false
let inlineItem = false
let noTraillingSpace = false
// let lastPoint = 0
const F_SM = {
  INIT: () => {
    lines = 1
    flag = null
    flagRec = []
    lerverUp = false
    inlineItem = false
    noTraillingSpace = false
  },
  NULL: () => {
    flag = null
  },
  CHANGE: state => {
    if (blockElement.includes(state) || flag !== state) {
      flag = state
      // lastPoint = point[flag]
    }
  },
  KEEP: state => {
    if (canLeverUpElement.includes(state)) {
      F_SM.LEVER_UP(state)
    }
  },
  DIG_IN: state => {
    flagRec.push(flag)
    F_SM.CHANGE(state)
  },
  DIG_OUT: () => {
    R_SM.TAG_END(flag)
    if (flagRec.length) {
      const newFlag = flagRec.pop()
      F_SM.CHANGE(newFlag)
    } else {
      F_SM.NULL()
    }
  },
  LEVER_UP: state => {
    lerverUp = true
    const num = flag && +flag.replace(state, '')
    if (flag && num) {
      flag = `${state}${leverUpHandler[state](num)}`
    } else {
      (point[flag] > point[state])
        ? F_SM.DIG_IN(flag)
        : flag && R_SM.TAG_END(flag)
      flag = `${state}${canLeverUpEleInitStateReflex[state]}`
    }
  },
  LEVER_DOWN: () => {
    lerverUp = false
    R_SM.TAG_START(flag)
  },
  NEW_LINE: () => {
    F_SM.DIG_OUT_UNTIL_BLOCKITEM()
    inlineItem = false
  },
  EXC_INLINE: () => {
    inlineItem = !inlineItem
  },
  ACTIVE: state => {
    state = state || (
      inlineItem ? flag : 'p'
    )
    const pf = point[flag]
    const ps = point[state]
    console.log(lines, char, state, ps, pf, flag, flagRec)

    lerverUp && F_SM.LEVER_DOWN()

    if (flag !== state) {
      if (inlineItem) {
        (point[flag] > point[state])
          ? F_SM.DIG_IN(flag)
          : flag && R_SM.TAG_END(flag)
        F_SM.CHANGE(state)
      } else {
        if (ps > pf) {
          console.log('>')
          flagRec.length
            ? (
              F_SM.DIG_OUT_UNTIL_BLOCKED(flagRec[flagRec.length - 1]),
              flag && R_SM.TAG_END(flag)
            )
            : F_SM.SHOW_DOWN()
          F_SM.CHANGE(state)
        } else if (pf === ps) {
          console.log('=')
          R_SM.TAG_END(flag)
          F_SM.CHANGE(state)
        } else {
          console.log('<')
          F_SM.DIG_IN(state)
        }
      }
      R_SM.TAG_START(flag)
    } else {
      if (inlineBlockElement.includes(flag)) {
        F_SM.KEEP(state)
      } else {
        R_SM.TAG_START(flag)
        F_SM.DIG_IN(state)
      }
    }
  },
  // 将当前处理上档
  EXCUTE: () => {
    F_SM.DIG_OUT()
  },
  // 清空队列
  SHOW_DOWN: () => {
    while (flag) {
      F_SM.EXCUTE()
    }
  },
  DIG_OUT_UNTIL_BLOCKED: points => {
    while (flag && point[flag] <= points) {
      F_SM.EXCUTE()
    }
  },
  DIG_OUT_UNTIL_BLOCKITEM: () => {
    F_SM.DIG_OUT_UNTIL_BLOCKED(PBI)
  }
}

let stream = null
const S_SM = {
  NULL: () => {
    stream = ''
  },
  ADD: (c) => {
    stream += c
  }
}

let result = null
const R_SM = {
  NULL: () => {
    result = ''
  },
  ADD: newStr => {
    result += newStr
  },
  TAG_START: tag => {
    R_SM.ADD(`<${tag}>`)
  },
  TAG_END: tag => {
    R_SM.ADD(stream)
    S_SM.NULL()
    R_SM.ADD(`</${tag}>`)
  }
}

/** parse
 *  读取字符串, 返回用于展示的HTML片段
 * @param {String} row 读取的字符串
 * @return {String} 用于展示的HTML片段
 */

let char = ''
export function parse (raw) {
  R_SM.NULL()
  S_SM.NULL()
  F_SM.INIT()

  for (let i = 0, l = raw.length; i < l; i++) {
    char = raw[i]
    handleCurChar(raw[i])
  }
  F_SM.SHOW_DOWN()

  console.log('@@@:', result)
  return result
}
const handleCurChar = curChar => {
  switch (curChar) {
    case '`':
      F_SM.EXC_INLINE()
      F_SM.ACTIVE('code')
    break
    case '+':
      F_SM.EXC_INLINE()
      F_SM.ACTIVE('sup')
    break
    case '-':
      F_SM.EXC_INLINE()
      F_SM.ACTIVE('sub')
    break
    case '#':
      noTraillingSpace = true
      F_SM.LEVER_UP('h')
    break
    case '*':
      noTraillingSpace = true
      F_SM.ACTIVE('li')
    break
    case '>':
      noTraillingSpace = true
      F_SM.ACTIVE('blockquote')
    break
    case '\n':
      lines ++
      F_SM.NEW_LINE()
    break
    case ' ':
      if (noTraillingSpace) {
        return null
      }
    default:
      noTraillingSpace = false
      F_SM.ACTIVE()
      S_SM.ADD(curChar)
    break
  }
}
