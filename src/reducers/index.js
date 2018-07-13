import { combineReducers } from 'redux'

import user from './userReducer'
import chartData from './chartDataReducer'
import depthChart from './depthChartReducer'

export default combineReducers({
  user,
  chartData,
  depthChart,
})