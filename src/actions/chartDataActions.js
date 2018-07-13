import _ from 'lodash'
const log = require('ololog').configure({
  locate: false
})

export function clearTrollbox () {
  // log.red('CLEAR_TROLLBOX: ' [])
  return {
    type: 'CLEAR_TROLLBOX',
    payload: [],
  }
}

export function trollBoxUpdate (__obj) {
  // log.red('trollBoxUpdate: ', __obj)
  return {
    type: 'TROLLBOX_UPDATE',
    payload: __obj,
  }
}

export function resetChart (__bool, __parent_func) {
  // log.red('__bool: ', __bool)
  // log.green('__parent_func: ', __parent_func)
  return {
    type: 'RESET_CHART',
    payload: __bool,
  }
}

export function toggleRuler (__bool, __parent_func) {
  // log.red('__bool: ', __bool)
  // log.green('__parent_func: ', __parent_func)
  return {
    type: 'TOGGLE_RULER',
    payload: __bool,
  }
}

export function setMaLength (__ma_length) {
  return {
    type: 'SET_MA_LENGTH',
    payload: __ma_length,
  }
}

export function autoSellToggle (__bool) {
  return {
    type: 'AUTO_SELL_TOGGLE',
    payload: __bool,
  }
}

export function autoBuyToggle (__bool) {
  return {
    type: 'AUTO_BUY_TOGGLE',
    payload: __bool,
  }
}

export function setFetchCandles (__bool) {
  return {
    type: 'SET_FETCH_CANDLES',
    payload: __bool,
  }
}

export function setBuyRisk (__buy_risk) {
  return {
    type: 'SET_BUY_RISK',
    payload: __buy_risk,
  }
}

export function setAutoSellPercentage (__auto_sell_percentage) {
  return {
    type: 'SET_AUTO_SELL_PERCENTAGE',
    payload: __auto_sell_percentage,
  }
}

export function setAutoBuyPercentage (__auto_buy_percentage) {
  return {
    type: 'SET_AUTO_BUY_PERCENTAGE',
    payload: __auto_buy_percentage,
  }
}

export function setSellRisk (__sell_risk) {
  return {
    type: 'SET_SELL_RISK',
    payload: __sell_risk,
  }
}

export function setSlaveBuyRisk (__slave_buy_risk) {
  // log.lightBlue('__slave_buy_risk', __slave_buy_risk)
  return {
    type: 'SET_SLAVE_BUY_RISK',
    payload: __slave_buy_risk,
  }
}

export function setSlaveSellRisk (__slave_sell_risk) {
  // log.lightRed('__slave_buy_risk', __slave_buy_risk)
  return {
    type: 'SET_SLAVE_SELL_RISK',
    payload: __slave_sell_risk,
  }
}

export function setMasterPercent (__master_percent) {
  return {
    type: 'SET_MASTER_PERCENT',
    payload: __master_percent,
  }
}

export function setMasterCompPercent (__master_comp_percent) {
  return {
    type: 'SET_MASTER_COMP_PERCENT',
    payload: __master_comp_percent,
  }
}

export function dragBuy (__bool) {
  return {
    type: 'DRAG_BUY',
    payload: __bool,
  }
}

export function dragSell (__bool) {
  return {
    type: 'DRAG_SELL',
    payload: __bool,
  }
}

export function set_closed_buy_orders (__closed_buy_orders) {
  return {
    type: 'SET_CLOSED_BUY_ORDERS',
    payload: __closed_buy_orders
  }
}

export function set_closed_sell_orders (__closed_sell_orders) {
  return {
    type: 'SET_CLOSED_SELL_ORDERS',
    payload: __closed_sell_orders
  }
}

export function setPercentageSelected (__id, __percent) {
  // log.blue('__id', __id)
  // log.blue('__percent', __percent)
  return {
    type: 'SET_PERCENTAGE_SELECTED',
    payload: {
      percentId: __id,
      percent: __percent,
    }
  }
}

export function setSlavePercentageSelected (__slave_id, __slave_percent) {
  return {
    type: 'SET_SLAVE_PERCENTAGE_SELECTED',
    payload: {
      slavePercentId: __slave_id,
      slavePercent: __slave_percent,
    }
  }
}

export function setInputStep (__input_step) {
  log.blue('__input_step', __input_step)
  return {
    type: 'SET_INPUT_STEP',
    payload: __input_step
  }
}

export function setMinTradeSize (__min_trade_size) {
  // log.green('__min_trade_size', __min_trade_size)
  return {
    type: 'SET_MIN_TRADE_SIZE',
    payload: __min_trade_size
  }
}

export function setResistanceHigh (__resistance_high) {
  // log.green('__resistance_high', __resistance_high)
  return {
    type: 'SET_RESISTANCE_HIGH',
    payload: __resistance_high
  }
}

export function setResistanceMid (__resistance_mid) {
  // log.blue('__resistance_mid', __resistance_mid)
  return {
    type: 'SET_RESISTANCE_MID',
    payload: __resistance_mid
  }
}

export function setResistanceLow (__resistance_low) {
  // log.red('__resistance_low', __resistance_low)
  return {
    type: 'SET_RESISTANCE_LOW',
    payload: __resistance_low
  }
}

export function setResistanceSpread (__resistance_spread) {
  // log.blue('__resistance_spread', __resistance_spread)
  return {
    type: 'SET_RESISTANCE_SPREAD',
    payload: __resistance_spread
  }
}

export function setSelected (__selected_arr) {
  // console.log('__selected_arr', __selected_arr)
  return {
    type: 'SET_SELECTED',
    payload: __selected_arr
  }
}

export function setPricesArray (__prices_arr) {
  return {
    type: 'SET_PRICES_ARRAY',
    payload: __prices_arr
  }
}

export function setNetGainsArray (__net_gains_arr) {
  // log.magenta('__net_gains_arr', __net_gains_arr)
  return {
    type: 'SET_NET_GAINS_ARRAY',
    payload: __net_gains_arr
  }
}

export function setRetracements_1 (retracements_1) {
  // log.magenta('retracements_1', retracements_1)
  return {
    type: 'SET_RETRACEMENTS_1',
    payload: retracements_1
  }
}

export function setRetracements_3 (retracements_3) {
  // log.green('retracements_3', retracements_3)
  return {
    type: 'SET_RETRACEMENTS_3',
    payload: retracements_3
  }
}

export function toggleFibOrder (__bool) {
  // log.magenta(__bool)
  return {
    type: 'TOGGLE_FIB_ORDER',
    payload: __bool
  }
}

export function setWorksheet (__worksheet) {
  // console.log('__worksheet', __worksheet)
  return {
    type: 'SET_WORKSHEET',
    payload: __worksheet
  }
}

export function setWorksheetSell (__worksheet_sell) {
  // console.log('__worksheet_sell', __worksheet_sell)
  return {
    type: 'SET_WORKSHEET_SELL',
    payload: __worksheet_sell
  }
}

export function setSpreadsheet (__spredsheet) {
  return {
    type: 'SET_SPREADSHEET',
    payload: __spredsheet
  }
}

export function enableFib (__bool) {
  return {
    type: 'ENABLE_FIB',
    payload: __bool
  }
}

export function setChartData (__chart_data) {
  console.log('__chart_data', __chart_data)
  return {
    type: 'SET_CHART_DATA',
    payload: __chart_data
  }
}

export function setRiskAmount (__risk_amount) {
  return {
    type: 'SET_RISK_AMOUNT',
    payload: __risk_amount
  }
}

export function setBase (__base) {
  return {
    type: 'SET_BASE',
    payload: __base
  }
}

export function setBaseAmount (__base_amount) {
  return {
    type: 'SET_BASE_AMOUNT',
    payload: __base_amount
  }
}

export function setComp (__comp) {
  return {
    type: 'SET_COMP',
    payload: __comp
  }
}

export function setRisk (__risk) {
  return {
    type: 'SET_RISK',
    payload: __risk
  }
}

export function setSlaveRisk (__slave_risk) {
  return {
    type: 'SET_SLAVE_RISK',
    payload: __slave_risk
  }
}

export function placeOpenOrders (__bool) {
  // log.red('__bool: ', __bool)
  return {
    type: 'PLACE_OPEN_ORDERS',
    payload: __bool
  }
}

export function setOpenOrders (__orders_arr) {
  return {
    type: 'SET_OPEN_ORDERS',
    payload: __orders_arr
  }
}

export function setOpenBuyOrders (__open_buy_orders) {
  return {
    type: 'SET_OPEN_BUY_ORDERS',
    payload: __open_buy_orders
  }
}

export function buyOrderUpdate (__buy_order) {
  return {
    type: 'BUY_ORDER_UPDATE',
    payload: __buy_order
  }
}

export function setOpenSellOrders (__open_sell_orders) {
  return {
    type: 'SET_OPEN_SELL_ORDERS',
    payload: __open_sell_orders
  }
}

export function setOrderHistory (__order_history_arr) {
  return {
    type: 'SET_ORDER_HISTORY',
    payload: __order_history_arr
  }
}

export function setAllOrders (__all_orders_arr) {
  return {
    type: 'SET_ALL_ORDERS',
    payload: __all_orders_arr
  }
}

export function setOrderViewToggle (__view_toggle) {
  return {
    type: 'SET_ORDER_VIEW_TOGGLE',
    payload: __view_toggle
  }
}

export function setOrderInfo (__info) {

  return {
    type: 'SET_ORDER_INFO',
    payload: __info
  }

}

export function setOrderSelected (__order_id) {
  // console.log('setOrderSelected', __order_id)
  return {
    type: 'SET_ORDER_SELECTED',
    payload: __order_id
  }
}

export function setChartInterval (__interval) {
  return {
    type: 'SET_INTERVAL',
    payload: __interval
  }
}

export function setMarket (__market) {
  return {
    type: 'SET_MARKET',
    payload: __market
  }
}

export function setSymbol (__symbol) {
  return {
    type: 'SET_SYMBOL',
    payload: __symbol
  }
}

export function setAllMarkets (__all_markets) {
  return {
    type: 'SET_ALL_MARKETS',
    allMarkets: __all_markets
  }
}

export function requestMarkets (__base, __quote) {
  let __requested_markets = []
  for (let i = 0; i < __quote.length; i++) {
    __requested_markets.push({
      market: __base + '-' + __quote[i],
      symbol: __quote[i] + '/' + __base
    })
  }
  return __requested_markets
}

export function setSide (__side) {
  return {
    type: 'SET_SIDE',
    payload: __side
  }
}

export function setOrderType (__side) {
  let orderType
  if (__side === 'buy') {
    orderType = 'LIMIT_BUY'
  }
  if (__side === 'sell') {
    orderType = 'LIMIT_SELL'
  }
  return {
    type: 'SET_ORDER_TYPE',
    payload: orderType
  }
}

export function fetchSide () {
  return {
    type: 'FETCH_SIDE'
  }
}

export function setBalances (__balances) {
  // log.blue('setBalances actions', __balances)
  return {
    type: 'SET_BALANCES',
    payload: __balances
  }
}

export function setParadigm (__paradigm) {
  return {
    type: 'SET_PARADIGM',
    payload: __paradigm
  }
}

export function setParadigmArray (__paradigm_arr) {
  return {
    type: 'SET_PARADIGM_ARRAY',
    payload: __paradigm_arr
  }
}

export function setParadigmArraySell (__paradigm_arr_sell) {
  return {
    type: 'SET_PARADIGM_ARRAY_SELL',
    payload: __paradigm_arr_sell
  }
}

export function setAmountArray (__amount_arr) {
  return {
    type: 'SET_AMOUNT_ARRAY',
    payload: __amount_arr
  }
}

export function handleModal (__bool, __title, __msg) {
  return {
    type: 'TOGGLE_MODAL',
    payload: { open: __bool, title: __title, msg: __msg}
  }
}

export function setClose (__close) {
  return {
    type: 'SET_CLOSE',
    payload: __close
  }
}

export function setRulers (__rulers) {
  return {
    type: 'SET_RULERS',
    payload: __rulers
  }
}

export function cloneValue (__value) {
  return {
    type: 'CLONE_VALUE',
    payload: __value
  }
}

export function setLotSum (__lotSum) {
  return {
    type: 'LOT_SUM',
    payload: __lotSum
  }
}

export function setLotSumSell (__lotSum_sell) {
  return {
    type: 'LOT_SUM_SELL',
    payload: __lotSum_sell
  }
}

export function setLotSumArray (__lotSumArr) {
  return {
    type: 'LOT_SUM_ARRAY',
    payload: __lotSumArr
  }
}

export function setLotSumArraySell (__lotSumArr_sell) {
  return {
    type: 'LOT_SUM_ARRAY_SELL',
    payload: __lotSumArr_sell
  }
}

export function setInterval (__interval) {
  return {
    type: 'SET_INTERVAL',
    payload: __interval
  }
}