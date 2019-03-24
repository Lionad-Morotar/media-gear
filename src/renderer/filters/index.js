function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/** timeAgo
 *  将时间单位转换为离现在几分几秒的形式
 */
export function timeAgo (time) {
  const resReflex = {
    '0 minutes': 'just now'
  }
  var res = ''
  const between = Date.now() / 1000 - Number(time)

  if (between < 3600) {
    res = pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    res = pluralize(~~(between / 3600), ' hour')
  } else {
    res = pluralize(~~(between / 86400), ' day')
  }

  return resReflex[res] || res
}

/** numberFormatter
 *  将数字转为计算机大小单位
 */
// export function numberFormatter (num, digits) {
//   const si = [
//     { value: 1E18, symbol: 'E' },
//     { value: 1E15, symbol: 'P' },
//     { value: 1E12, symbol: 'T' },
//     { value: 1E9, symbol: 'G' },
//     { value: 1E6, symbol: 'M' },
//     { value: 1E3, symbol: 'k' }
//   ]
//   for (let i = 0; i < si.length; i++) {
//     if (num >= si[i].value) {
//       return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
//     }
//   }
//   return num.toString()
// }

/** toThousandFilter
 *  将数组转为千数位小数点的形式
 */
export function toThousandFilter (num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
