import copyToClipboard from 'copy-to-clipboard'
import _ from 'lodash'
import { timeFormat } from 'd3-time-format'
import { tsvParse, csvParse } from  'd3-dsv'
import { timeParse } from 'd3-time-format'


let __timeFormat = timeFormat('%c')

const log = require('ololog').configure({
  locate: false
})

function parseData(parse) {
  return function(d) {
    d.date = parse(d.date)
    d.open = +d.open
    d.high = +d.high
    d.low = +d.low
    d.close = +d.close
    d.volume = +d.volume

    return d
  }
}

const parseDate = timeParse('%Y-%m-%d')

export function getData() {
  const promiseMSFT = fetch('//rrag.github.io/react-stockcharts/data/MSFT.tsv')
    .then(response => response.text())
    .then(data => tsvParse(data, parseData(parseDate)))
  return promiseMSFT
}

export function __toFixed (__number, __digits, __min, __max, __is_balance) {

  const sign = Math.sign(__number)
  let digits

  if (!__number) {
    return 0
  } else if (__is_balance && __number < 0.000001) {
    return 0
  } else {
    if (__min && __max) {
      if (__number > 1) {
        digits = __min
      } else {
        digits = __max
      }
    } else if (__digits) {
      digits = __digits
    } else {
      if (__number > 1) {
        digits = 2
      } else {
        digits = 10
      }
    }

    const reg_ex = new RegExp('(\\d+\\.\\d{' + digits + '})(\\d)')
    const number = __number.toString()

    const array = number.match(reg_ex)
    const result =  array ? parseFloat(array[1]) : __number.valueOf()

    if (sign == -1) {
      return -result
    } else {
      return result
    }

  }
}

export function __error (__err) {

  return JSON.stringify(__err)

}

export function refreshAutoTrade () {

}

export function copy (__val) {
  copyToClipboard(__val)
}

export function currencyFormat (__base) {
  if (__base === 'USDT') {
    return '.2f'
  } else {
    return '.10f'
  }
}

export function mouseCoordinateY__format (__base) {
  if (__base === 'USDT' || __base === 'USD') {
    return '.2f'
  } else {
    return '.8f'
  }
}

export function color () {
  return {
    light: '#FFFFFF',
    buy: '#6495ed',
    sell: '#FF69B4',
    mid: '#555555',
    dark: '#444444',
    warning: '#F60300',

    buy_rgb: 'rgba(100, 149, 237, 1)',
    sell_rgb: 'rgba(255, 105, 180, 1)',
    mid_rgb: 'rgba(70, 70, 70, 1)',

    side_rgb: function (__side, __opacity) {
      if (__side === 'buy' || __side === 'LIMIT_BUY') {
        return 'rgba(100, 149, 237, ' + __opacity + ')'
      } else if (__side === 'sell' || __side === 'LIMIT_SELL') {
        let opacity = __opacity * 0.80
        return 'rgba(255, 105, 180, ' + opacity + ')'
      } else if (__side === 'all') {
        return 'rgba(68, 68, 68, ' + __opacity + ')'
      }
    },
    side: function (__side) {
      if (__side === 'neutral') {
        return '#FF8200'
      } else if (__side === 'buy' || __side === 'LIMIT_BUY') {
        return '#6495ED'
      } else if (__side === 'sell' || __side === 'LIMIT_SELL') {
        return '#FF69B4'
      }
    }
  }
}

export function spreadsheet () {

  return [{
    'title': '__p_single_order',
    'worksheet_id': '__p_single_order'
  }, {
    'title': '__p_linear_square',
    'worksheet_id': '__p_linear_square'
  }, {
    'title': '__p_linear_equal',
    'worksheet_id': '__p_linear_equal'
  }, {
    'title': '__p_linear_20',
    'worksheet_id': '__p_linear0'
  }, {
    'title': '__p_circle_curve_over',
    'worksheet_id': '__p_circle_curve_over'
  }, {
    'title': '__p_circle_curve_under',
    'worksheet_id': '__p_circle_curve_under'
  }, {
    'title': '__p_sigmoid_square',
    'worksheet_id': '__p_sigmoid_square'
  }, {
    'title': '__p_MIAH__linear_square',
    'worksheet_id': '__p_MIAH__linear_square'
  }]

}

export function cancelOrder (__order_id) {


}

export function __uniq (__array_1, __array_2) {
  let array = __array_1.concat(__array_2)
  return array.filter(function (value, index, self) {
    return self.indexOf(value) === index
  })
}

export function __non_Uniq (__array_1, __array_2) {
  let array = __array_1.concat(__array_2)
  return array.filter(function (value, index, self) {
    return self.indexOf(value) !== index
  })
}

const ids_exist = [
  '1111',
  '2222',
  'aaaa'

]

const ids_new = [
  '1111',
  '2222',
  'zzzz',
  'dddd'
]

export function __uniq_Filter (__array_1, __array_2) {
  const a = __array_1.filter(function (obj) {
    return __array_2.indexOf(obj) == -1
  })
  const b = __array_2.filter(function (obj) {
    return __array_1.indexOf(obj) == -1
  })
  return a.concat(b)
}

export function __uniq_Orders (__orders_1, __orders_2) {
  const a = __orders_1.map(function (__order_1) {
    return __orders_1.id
  })
  const b = __orders_2.map(function (__order_2) {
    return __order_2.id
  })
  return __uniq_Filter(a, b)
}


// Array.prototype.unique = function() {
//   return this.filter(function (value, index, self) {
//     return self.indexOf(value) === index;
//   });
// }
//
// function __non_Uniq (__array_1, __array_2) {
//   let array = __array_1.concat(__array_2)
//   return array.filter(function (value, index, self) {
//     return self.indexOf(value) !== index;
//   })
// }
//
// const ids_new = [
//   '1111',
//   '2222',
//   'bbbb'
// ]
//
// const ids_exist = [
//   '1111',
//   '2222',
//   'aaaa',
//
// ]
//
//
//
//
// function __uniq_OneWay (__array_1, __array_2) {
//   return __array_1.filter(function (obj) {
//     return __array_2.indexOf(obj) == -1
//   })
// }
//
// let new_not_in_exist = __uniq_OneWay(ids_new, ids_exist)
//
// console.log('new_not_in_exist', new_not_in_exist)
//
// function __uniq_Filter (__array_1, __array_2) {
//   const a = __array_1.filter(function (obj) {
//     return __array_2.indexOf(obj) == -1
//   })
//   const b = __array_2.filter(function (obj) {
//     return __array_1.indexOf(obj) == -1
//   })
//   return a.concat(b)
// }
//
// let uniq_filter = __uniq_Filter(ids_exist, ids_new)
//
// console.log('uniq_filter', uniq_filter)