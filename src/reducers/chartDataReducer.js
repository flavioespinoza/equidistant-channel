const foundation = 0.0002714
const conversion_percentage = 2.7673 / 100
const log = require('ololog').configure({
  locate: false
})
const _ = require('lodash')
const utils = require('../utils')

export default function reducer(state = {

  fetching: false,
  fetched: false,
  candleData: [],
  placeOpenOrders: true,
  openOrders: [],
  textList_1: [], //TODO: Change to openOrdersList_1
  orderHistory: [],
  orderHistoryList_1: [],
  orderViewToggle: null,
  orderInfo: {
    start: null,
    end: null
  },
  orderSelected: null,
  interval: null,
  orderType: null, /** LIMIT_BUY or LIMIT_SELL */
  side: 'sell', /** buy or sell */
  market: null,
  symbol: null,
  allMarkets: null,
  balances: {},
  base: {},
  comp: {},
  baseAmount: 0,
  orderCancelled: null,
  ordersCancelled: [],
  error: null,
  modalOpen: false,
  modalTitle: null,
  modalMsg: null,
  close: null,
  rulers: [],
  clone: null,
  retracements_1: [],
  retracements_3: [],
  paradigm: '__p_single_order',
  paradigmArray: [0],
  paradigmArray_sell: [0],
  amountArray: [0],
  riskDivision: 0,  // TODO: Remove if not used
  risk: 0,
  slaveRisk: 0,
  riskAmount: 50, // TODO: Remove if not used
  lotSumArray: [],
  lotSumArray_sell: [],
  lotSum: 0,
  lotSum_sell: 0,
  enableFib: false,
  worksheet: {
    "idx": 0,
    "title": "__p_single_order",
    "grid": [
      [
        {
          "value": "bid",
          "readOnly": true
        },
        {
          "value": "x_coord",
          "readOnly": true
        },
        {
          "value": "x_coord_Σ",
          "readOnly": true
        },
        {
          "value": "x_%",
          "readOnly": true
        },
        {
          "value": "risk",
          "readOnly": true
        },
        {
          "value": "amount",
          "readOnly": true
        }
      ],
      [
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 0
        }
      ],
      [
        {
          "value": 50
        },
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 0
        }
      ],
      [
        {
          "value": 100
        },
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 1
        },
        {
          "value": 0
        },
        {
          "value": 0
        }
      ]
    ]
  },
  worksheet_sell: {
    "idx": 0,
    "title": "__p_single_order",
    "grid": [
      [
        {
          "value": "bid",
          "readOnly": true
        },
        {
          "value": "x_coord",
          "readOnly": true
        },
        {
          "value": "x_coord_Σ",
          "readOnly": true
        },
        {
          "value": "x_%",
          "readOnly": true
        },
        {
          "value": "risk",
          "readOnly": true
        },
        {
          "value": "amount",
          "readOnly": true
        }
      ],
      [
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 0
        }
      ],
      [
        {
          "value": 50
        },
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 0
        }
      ],
      [
        {
          "value": 100
        },
        {
          "value": 0
        },
        {
          "value": 0
        },
        {
          "value": 1
        },
        {
          "value": 0
        },
        {
          "value": 0
        }
      ]
    ]
  },
  spreadsheet: [{
    "title": "__p_single_order",
    "worksheet_id": "__p_single_order"
  }, {
    "title": "__p_linear_square",
    "worksheet_id": "__p_linear_square"
  }, {
    "title": "__p_linear_equal",
    "worksheet_id": "__p_linear_equal"
  },

    //   {
    //   "title": "__p_linear_20",
    //   "worksheet_id": "__p_linear0"
    // },

    {
      "title": "__p_circle_curve_over",
      "worksheet_id": "__p_circle_curve_over"
    }, {
      "title": "__p_circle_curve_under",
      "worksheet_id": "__p_circle_curve_under"
    }, {
      "title": "__p_sigmoid_square",
      "worksheet_id": "__p_sigmoid_square"
    },

    //   {
    //   "title": "__p_MIAH__linear_square",
    //   "worksheet_id": "__p_MIAH__linear_square"
    // }

  ],
  toggleFibOrder: false,
  netGainsArray: [],
  pricesArray: [],
  selected: [],
  resistance_high: 0,
  resistance_mid: 0,
  resistance_low: 0,
  resistance_spread: 4,
  minTradeSize: 0.01,
  inputStep: 0.00000001, // MUE
  masterPercent: 20,
  masterCompPercent: 100,
  percent: 0,
  percentId: 0,
  slavePercent: 0,
  slavePercentId: 0,
  expanded: false,
  open_buy_orders: [],
  open_sell_orders: [],
  closed_buy_orders: [],
  closed_sell_orders: [],
  min_profit: (foundation * conversion_percentage) + foundation,
  buy_price: foundation,
  drag_BUY: true,
  drag_SELL: true,
  buy_risk: 0,
  sell_risk: 0,
  slave_buy_risk: 0,
  slave_sell_risk: 0,
  min_trade_value: 0.001,
  min_buy_amount: 0.001,
  precision: 8,
  fetch_candles: true,
  market_summary: {},
  auto_sell_percentage: 1.0,
  auto_buy_percentage:  1.0,
  auto_sell_toggle: true,
  auto_buy_toggle: true,
  last: {},
  ma_length: 20,
  toggle_ruler: false,
  trollbox: [],
  order_book: {asks: [], bids: []},
  order_book_update: {},

}, action) {
  switch (action.type) {
    case 'ORDER_BOOK': {
      // log.green('ORDER_BOOK')
      // console.log(action.payload)
      return {
        ...state,
        order_book: action.payload
      }
    }
    case 'ORDER_BOOK_UPDATE': {
      // console.log('ORDER_BOOK_UPDATE', action.payload)

      let asks = state.order_book.asks
      let bids = state.order_book.bids

      let asks_update = action.payload.asks
      let bids_update = action.payload.bids

      for (let i = 0; i < asks_update.length; i++) {

        if (asks_update[i].TY === 0) {
          asks.push({
            Q: asks_update[i].Q,
            R: asks_update[i].R,
            side: 'sell'
          })
        }

        if (asks_update[i].TY === 1) {
          _.remove(asks, function (obj) {
            return obj.R === asks_update[i].R
          })
        }

        if (asks_update[i].TY === 2) {
          let idx = _.findIndex(asks, function (obj) {
            return obj.R === asks_update[i].R
          })
          // log.red(idx)
          // log.red(asks[idx])
          asks[idx] = {
            Q: asks_update[i].Q,
            R: asks_update[i].R,
            side: 'sell',
          }
          // log.lightRed(asks[idx])
        }
      }


      for (let b = 0; b < bids_update.length; b++) {

        if (bids_update[b].TY === 0) {
          bids.push({
            Q: bids_update[b].Q,
            R: bids_update[b].R,
            side: 'buy',
          })
        }

        if (bids_update[b].TY === 1) {
          _.remove(bids, function (obj) {
            return obj.R === bids_update[b].R
          })
        }

        if (bids_update[b].TY === 2) {
          let idx = _.findIndex(bids, function (obj) {
            return obj.R === bids_update[b].R
          })
          // log.blue(idx)
          // log.blue(bids[idx])
          bids[idx] = {
            Q: bids_update[b].Q,
            R: bids_update[b].R,
            side: 'buy',
          }
          // log.cyan(bids[idx])
        }

      }

      const order_book = {
        asks: _.sortBy(asks, function (obj) {
          return obj.R
        }),
        bids: _.sortBy(bids, function (obj) {
          return -(obj.R)
        })
      }

      // console.log(order_book)

      return {
        ...state,
        order_book: order_book,
        order_book_update: action.payload
      }
    }
    case 'CLEAR_TROLLBOX': {
      // console.log('CLEAR_TROLLBOX', action.payload)
      return {
        ...state,
        trollbox: []
      }
    }
    case 'TROLLBOX_UPDATE': {
      // console.log('TROLLBOX_UPDATE', action.payload)
      let newState = [action.payload, ...state.trollbox]
      return {
        ...state,
        trollbox: newState
      }
    }
    case 'RESET_CHART': {
      log.blue('RESET_CHART', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        reset_chart: action.payload,
      }
    }
    case 'TOGGLE_RULER': {
      // log.blue('TOGGLE_RULER', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        toggle_ruler: action.payload,
      }
    }
    case 'SET_MA_LENGTH': {
      log.yellow('SET_MA_LENGTH', JSON.stringify(action.payload, null, 2))
      return {
        ...state,
        fetching: false,
        fetched: true,
        ma_length: action.payload,
      }
    }
    case 'AUTO_SELL_TOGGLE': {
      // log.red('AUTO_SELL_TOGGLE', JSON.stringify(action.payload, null, 2))
      return {
        ...state,
        fetching: false,
        fetched: true,
        auto_sell_toggle: action.payload,
      }
    }
    case 'AUTO_BUY_TOGGLE': {
      // log.blue('AUTO_BUY_TOGGLE', JSON.stringify(action.payload, null, 2))
      return {
        ...state,
        fetching: false,
        fetched: true,
        auto_buy_toggle: action.payload,
      }
    }
    case 'RESET_BUY_RISK': {
      // log.black('RESET_BUY_RISK', JSON.stringify(action.payload, null, 2))
      let available_balance = action.payload.Available
      let master_percent = state.masterPercent
      let buy_risk = utils.__toFixed(available_balance * (master_percent / 100), null, 2, 8)
      let percent = state.percent
      let slave_buy_risk = utils.__toFixed(buy_risk * percent, null, 2, 8)

      return {
        ...state,
        fetching: false,
        fetched: true,
        buy_risk: buy_risk,
        slave_buy_risk: slave_buy_risk,
      }
    }
    case 'RESET_SELL_RISK': {
      // log.black('RESET_SELL_RISK', JSON.stringify(action.payload, null, 2))
      let available_balance = action.payload.Available
      let master_percent = state.masterCompPercent
      let sell_risk = utils.__toFixed(available_balance * (master_percent / 100), null, 2, 8)
      let slave_percent = state.slavePercent
      let slave_sell_risk = utils.__toFixed(sell_risk * slave_percent, null, 2, 8)
      return {
        ...state,
        fetching: false,
        fetched: true,
        sell_risk: sell_risk,
        slave_sell_risk: slave_sell_risk,
      }
    }
    case 'BUY_ORDER_UPDATE': {

      let open_buy_orders = state.open_buy_orders

      if (action.payload.status === 'open') {

        let update_open_buy_orders = []
        update_open_buy_orders[0] = action.payload

        for (let i = 0; i < open_buy_orders.length; i++) {
          update_open_buy_orders.push(open_buy_orders[i])
        }

        return {
          ...state,
          open_buy_orders: update_open_buy_orders,
        }

      } else if (action.payload.status === 'partial') {

        open_buy_orders = _.filter(open_buy_orders, function (__obj) {
          return __obj.id !== action.payload.id
        })

        let update_open_buy_orders = []
        update_open_buy_orders[0] = action.payload

        for (let i = 0; i < open_buy_orders.length; i++) {
          update_open_buy_orders.push(open_buy_orders[i])
        }

        return {
          ...state,
          open_buy_orders: update_open_buy_orders,
        }

      } else if (action.payload.status === 'fill') {

        open_buy_orders = _.filter(open_buy_orders, function (__obj) {
          return __obj.id !== action.payload.id
        })

        return {
          ...state,
          open_buy_orders: open_buy_orders,
        }

      } else if (action.payload.status === 'cancel') {

        open_buy_orders = _.filter(open_buy_orders, function (__obj) {
          return __obj.id !== action.payload.id
        })

        return {
          ...state,
          open_buy_orders: open_buy_orders,
        }

      } else {
        alert('Buy Order Update Error: ' + action.payload)
      }
      break
    }
    case 'SELL_ORDER_UPDATE': {

      let open_sell_orders = state.open_sell_orders

      if (action.payload.status === 'open') {

        let update_open_sell_orders = []

        update_open_sell_orders[0] = action.payload

        for (let i = 0; i < open_sell_orders.length; i++) {
          update_open_sell_orders.push(open_sell_orders[i])
        }

        return {
          ...state,
          open_sell_orders: update_open_sell_orders,
        }

      } else if (action.payload.status === 'partial') {

        open_sell_orders = _.filter(open_sell_orders, function (__obj) {
          return __obj.id !== action.payload.id
        })
        let update_open_sell_orders = []

        update_open_sell_orders[0] = action.payload

        for (let i = 0; i < open_sell_orders.length; i++) {
          update_open_sell_orders.push(open_sell_orders[i])
        }

        return {
          ...state,
          open_sell_orders: update_open_sell_orders,
        }

      } else if (action.payload.status === 'fill') {

        open_sell_orders = _.filter(open_sell_orders, function (__obj) {
          return __obj.id !== action.payload.id
        })

        return {
          ...state,
          open_sell_orders: open_sell_orders,
        }

      } else if (action.payload.status === 'cancel') {

        open_sell_orders = _.filter(open_sell_orders, function (__obj) {
          return __obj.id !== action.payload.id
        })

        return {
          ...state,
          open_sell_orders: open_sell_orders,
        }


      } else {

        alert('Buy Order Update Error: ' + action.payload)

      }
      break
    }
    case 'SET_MARKET_SUMMARY': {
      // log.black('SET_MARKET_SUMMARY', JSON.stringify(action.payload, null, 2))
      return {
        ...state,
        fetching: false,
        fetched: true,
        market_summary: action.payload
      }
    }
    case 'SET_LAST': {
      // console.log('SET_LAST', JSON.stringify(action.payload, null, 2))
      return {
        ...state,
        fetching: false,
        fetched: true,
        last: action.payload
      }
    }
    case 'SET_AUTO_SELL_PERCENTAGE': {
      // log.black('SET_AUTO_SELL_PERCENTAGE', JSON.stringify(action.payload, null, 2))
      return {
        ...state,
        fetching: false,
        fetched: true,
        auto_sell_percentage: action.payload
      }
    }
    case 'SET_AUTO_BUY_PERCENTAGE': {
      // log.black('SET_AUTO_BUY_PERCENTAGE', JSON.stringify(action.payload, null, 2))
      return {
        ...state,
        fetching: false,
        fetched: true,
        auto_buy_percentage: action.payload
      }
    }
    case 'GET_ORDERS_CANCELLED': {
      // console.log('GET_ORDERS_CANCELLED', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        ordersCancelled: action.payload
      }
    }
    case 'PUSH_ORDERS_CANCELLED': {
      // console.log('PUSH_ORDERS_CANCELLED', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        ordersCancelled: action.payload
      }
    }
    case 'SET_FETCH_CANDLES': {
      return {
        ...state,
        fetch_candles: action.payload,
      }
    }
    case 'SET_PRECISION': {
      return {
        ...state,
        precision: action.payload,
      }
    }
    case 'SET_BUY_RISK': {
      return {
        ...state,
        buy_risk: action.payload,
      }
    }
    case 'SET_SLAVE_BUY_RISK': {
      return {
        ...state,
        slave_buy_risk: action.payload,
      }
    }
    case 'SET_SELL_RISK': {
      return {
        ...state,
        sell_risk: action.payload,
      }
    }
    case 'SET_SLAVE_SELL_RISK': {
      return {
        ...state,
        slave_sell_risk: action.payload,
      }
    }
    case 'DRAG_BUY': {
      return {
        ...state,
        drag_BUY: action.payload,
      }
    }
    case 'DRAG_SELL': {
      return {
        ...state,
        drag_SELL: action.payload,
      }
    }
    case 'SET_CLOSED_BUY_ORDERS': {
      return {
        ...state,
        closed_buy_orders: action.payload,
      }
    }
    case 'SET_OPEN_BUY_ORDERS': {
      return {
        ...state,
        open_buy_orders: action.payload,
      }
    }
    case 'SET_OPEN_SELL_ORDERS': {
      return {
        ...state,
        open_sell_orders: action.payload,
      }
    }
    case 'SET_CLOSED_SELL_ORDERS': {
      return {
        ...state,
        closed_sell_orders: action.payload,
      }
    }
    case 'TOGGLE_EXPANDED': {
      return {
        ...state,
        expanded: action.payload.percent,
      }
    }
    case 'SET_MASTER_PERCENT': {
      return {
        ...state,
        masterPercent: action.payload,
      }
    }
    case 'SET_MASTER_COMP_PERCENT': {
      return {
        ...state,
        masterCompPercent: action.payload,
      }
    }
    case 'SET_PERCENTAGE_SELECTED': {
      return {
        ...state,
        percent: action.payload.percent,
        percentId: action.payload.percentId,
      }
    }
    case 'SET_SLAVE_PERCENTAGE_SELECTED': {
      return {
        ...state,
        slavePercent: action.payload.slavePercent,
        slavePercentId: action.payload.slavePercentId,
      }
    }
    case 'SET_INPUT_STEP': {
      return {
        ...state,
        inputStep: action.payload
      }
    }
    case 'SET_RESISTANCE_HIGH': {
      return {
        ...state,
        resistance_high: action.payload
      }
    }
    case 'SET_RESISTANCE_MID': {
      return {
        ...state,
        resistance_mid: action.payload
      }
    }
    case 'SET_RESISTANCE_LOW': {
      return {
        ...state,
        resistance_low: action.payload
      }
    }
    case 'SET_RESISTANCE_SPREAD': {
      // log.yellow('resistance_spread', action.payload)
      return {
        ...state,
        resistance_spread: action.payload
      }
    }
    case 'SET_SELECTED': {
      return {
        ...state,
        selected: action.payload
      }
    }
    case 'SET_PRICES_ARRAY': {
      return {
        ...state,
        pricesArray: action.payload
      }
    }
    case 'SET_NET_GAINS_ARRAY': {
      // log.blue('SET_NET_GAINS_ARRAY', action.payload)
      return {
        ...state,
        netGainsArray: action.payload
      }
    }
    case 'TOGGLE_FIB_ORDER': {
      // log.red('TOGGLE_FIB_ORDER', action.payload)
      return {
        ...state,
        toggleFibOrder: action.payload
      }
    }
    case 'SET_WORKSHEET': {
      return {
        ...state,
        worksheet: action.payload
      }
    }
    case 'SET_WORKSHEET_SELL': {
      return {
        ...state,
        worksheet_sell: action.payload
      }
    }
    case 'SET_SPREADSHEET': {
      return {
        ...state,
        spreadsheet: action.payload
      }
    }
    case 'ENABLE_FIB': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        enableFib: action.payload
      }
    }
    case 'SET_RETRACEMENTS_1': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        retracements_1: action.payload
      }
    }
    case 'SET_RETRACEMENTS_3': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        retracements_3: action.payload
      }
    }
    case 'SET_RISK_AMOUNT': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        riskAmount: action.payload
      }
    }
    case 'SET_RISK_DIVISION': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        riskDivision: action.payload
      }
    }
    case 'SET_BASE': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        base: action.payload
      }
    }
    case 'SET_BASE_AMOUNT': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        baseAmount: action.payload
      }
    }
    case 'SET_COMP': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        comp: action.payload
      }
    }
    case 'SET_RISK': {
      // console.log('SET_RISK', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        risk: action.payload
      }
    }
    case 'SET_SLAVE_RISK': {
      // console.log('SET_RISK', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        slaveRisk: action.payload
      }
    }
    case 'SET_DATES': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        dates: action.payload
      }
    }
    case 'SET_CHART_DATA': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        candleData: action.payload
      }
    }
    case 'SET_ORDER_VIEW_TOGGLE': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        orderViewToggle: action.payload
      }
    }
    case 'SET_ORDER_INFO': {
      // console.log('SET_ORDER_INFO', JSON.stringify(action.payload))
      return {
        ...state,
        fetching: false,
        fetched: true,
        orderInfo: action.payload
      }
    }
    case 'SET_ORDER_INFO_VIEW': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        orderInfoView: action.payload
      }
    }
    case 'SET_ORDER_SELECTED': {
      // console.log('SET_ORDER_SELECTED', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        orderSelected: action.payload
      }
    }
    case 'PLACE_OPEN_ORDERS': {
      // log.yellow('PLACE_OPEN_ORDERS', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        placeOpenOrders: action.payload
      }
    }
    case 'SET_OPEN_ORDERS': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        openOrders: action.payload,
        textList_1: action.payload,
      }
    }
    case 'SET_ORDER_HISTORY': {
      // console.log('SET_ORDER_HISTORY', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        orderHistory: action.payload,
        orderHistoryList_1: action.payload,
      }
    }
    case 'SET_ALL_ORDERS': {
      // console.log('SET_ALL_ORDERS', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        allOrders: action.payload
      }
    }
    case 'SET_INTERVAL': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        interval: action.payload
      }
    }
    case 'SET_MARKET': {
      // console.log('market', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        market: action.payload
      }
    }
    case 'SET_SYMBOL': {
      // console.log('symbol', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        symbol: action.payload
      }
    }
    case 'SET_ALL_MARKETS': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        allMarkets: action.payload
      }
    }
    case 'SET_BALANCES': {
      // console.log('SET_BALANCES', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        balances: action.payload
      }
    }
    case 'SET_SIDE': {
      // console.log('SET_SIDE', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        side: action.payload
      }
    }
    case 'SET_ORDER_TYPE': {
      // console.log('SET_ORDER_TYPE', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        orderType: action.payload
      }
    }
    case 'SET_PARADIGM': {
      return {
        ...state,
        paradigm: action.payload
      }
    }
    case 'SET_PARADIGM_ARRAY': {
      return {
        ...state,
        paradigmArray: action.payload
      }
    }
    case 'SET_PARADIGM_ARRAY_SELL': {
      return {
        ...state,
        paradigmArray_sell: action.payload
      }
    }
    case 'SET_AMOUNT_ARRAY': {
      return {
        ...state,
        amountArray: action.payload
      }
    }
    case 'TOGGLE_MODAL': {
      return {
        ...state,
        modalOpen: action.payload.open,
        modalTitle: action.payload.title,
        modalMsg: action.payload.msg,
      }
    }
    case 'SET_CLOSE': {
      // console.log('SET_CLOSE', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        close: action.payload
      }
    }
    case 'SET_RULERS': {
      // console.log('SET_RULERS', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        rulers: action.payload
      }
    }
    case 'CLONE_VALUE': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        clone: action.payload
      }
    }
    case 'LOT_SUM': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        lotSum: action.payload
      }
    }
    case 'LOT_SUM_SELL': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        lotSum_sell: action.payload
      }
    }
    case 'LOT_SUM_ARRAY': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        lotSumArray: action.payload
      }
    }
    case 'LOT_SUM_ARRAY_SELL': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        lotSumArray_sell: action.payload
      }
    }
  }
  
  return state
  
}
