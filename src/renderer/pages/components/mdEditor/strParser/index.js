/** 将字符串解析为Markdonw格式的HTML的状态机实现
 * @author: Lionad <tangnad@qq.com>
 */

/* eslint-disable */

/** 一些常用的捕获正则 */

const reAlphaChar = /.[a-zA-Z]/
const reNumberChar = /.[0-9]/

/** 状态机 state machine */

let flag = null
const stateInitReflex = {
  h: 1
}
const F_SM = {
  'NULL': () => {
    flag = null
  },
  'CHANG': state => {
    flag = state
  },
  'KEEP': (state = 'div') => {
    if (!flag) {
      F_SM['CHANG'](state)
    }
  },
  'LEVER_UP': state => {
    const num = flag && +flag.replace(state, '')
    if (flag && num) {
      flag = `${state}${num + 1}`
    } else {
      flag = `${state}${stateInitReflex[state]}`
    }
  },
  'EXCUTE': () => {
    flag ? (
      R_SM['UNSHIFT'](),
      S_SM['NULL'](),
      F_SM['NULL']()
    ) : (
      F_SM['CHANG']('div'),
      F_SM['EXCUTE']()
    )
  }
}

let stream = null
const S_SM = {
  'NULL': () => {
    stream = ''
  },
  'ADD': (c) => {
    stream += c
  }
}

let result = null
const R_SM = {
  'NULL': () => {
    result = ''
  },
  'UNSHIFT': () => {
    result += `<${flag}>${stream}</${flag}>`
  }
}

/** parse
 *  读取字符串, 返回用于展示的HTML片段
 * @param {String} row 读取的字符串
 * @return {String} 用于展示的HTML片段
 */

export function parse (raw) {
  R_SM['NULL']()
  S_SM['NULL']()
  F_SM['NULL']()
  for (let i = 0, l = raw.length; i < l; i++) {
    const curChar = raw[i]
    handleCurChar(curChar)
  }
  if (stream) {
    F_SM['EXCUTE']()
  }

  return result
}
const handleCurChar = curChar => {
  switch (curChar) {

    case '#':
      F_SM['LEVER_UP']('h')
    break

    case '*':
    case '-':
    case '+':
      F_SM['KEEP']('li')
    break

    case '>':
      F_SM['KEEP']('blockquote')
    break

    case '\n':
      F_SM['EXCUTE']()
    break

    default:
      F_SM['KEEP']()
      S_SM['ADD'](curChar)
    break
  }
}

/** ATOM FUNC */
