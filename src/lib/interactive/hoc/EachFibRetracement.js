import React, { Component } from 'react'

import _ from 'lodash'

import PropTypes from 'prop-types'

import { head, last, noop, strokeDashTypes } from '../../utils'
import { getXValue } from '../../utils/ChartDataUtil'
import { saveNodeType, isHover } from '../utils'

import { getNewXY } from './EachTrendLine'
import StraightLine, { generateLine } from '../components/StraightLine'
import ClickableCircle from '../components/ClickableCircle'
import HoverTextNearMouse from '../components/HoverTextNearMouse'
import Text from '../components/Text'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as chartDataActions from '../../../actions/chartDataActions'
import * as utils from '../../../utils'

import { timeFormat } from 'd3-time-format'
import { DateDiff} from '../utils'

const formatDate = timeFormat('%b %e, %_I:%M %p')


const color = utils.color()
const log = require('ololog').configure({
  locate: false
})

function helper ({x1, y1, x2, y2}, worksheet, paradigmArray, lotSumArray, side, min_trade_value, slave_buy_risk, slave_sell_risk) {

  const dy = y2 - y1

  const retracements = paradigmArray.map(function (each, idx) {

    return {
      y: (y2 - (each / 100) * dy),
      x1: x1,
      x2: x2,
      percent: each,
      percentAboveZero: null,
      percentBelowOneHundred: null,
      lotDivision: lotSumArray[idx],
      gain: null,
      price: null,
      minTradeValue: 0,
      minTradeRequirementMet: true
    }

  })

  const zero = _.find(retracements, {percent: 100})
  const oneHundred = _.find(retracements, {percent: 0})

  _.each(retracements, function (obj, i) {
    let decimal = ((obj.y / oneHundred.y) - 1)
    retracements[i].percentBelowOneHundred = decimal * 100
  })

  _.each(retracements, function (obj, i) {
    let decimal = ((obj.y / zero.y) - 1)
    retracements[i].percentAboveZero = decimal * 100
  })

  _.each(retracements, function (obj, i) {
    retracements[i].price = obj.y
    if (side === 'sell') {
      retracements[i].gain = utils.__toFixed(obj.y * obj.lotDivision, null, 2, 8)

    } else if (side === 'buy') {
      retracements[i].gain = utils.__toFixed(obj.lotDivision / obj.y, null, 2, 8)
      retracements[i].minTradeValue = retracements[i].gain * retracements[i].price
    }
  })

  _.each(retracements, function (obj, i) {
    if (side === 'buy') {
      if (retracements[i].gain >= min_trade_value) {
        retracements[i].minTradeRequirementMet = true
      } else {
        retracements[i].minTradeRequirementMet = false
      }
    } else if (side === 'sell') {
      if (retracements[i].gain >= min_trade_value) {
        retracements[i].minTradeRequirementMet = true
      } else {
        retracements[i].minTradeRequirementMet = false
      }
    }
  })

  return retracements

}

class EachFibRetracement extends Component {
  constructor (props) {
    super(props)

    this.handleEdge1Drag = this.handleEdge1Drag.bind(this)
    this.handleEdge2Drag = this.handleEdge2Drag.bind(this)
    this.handleLineNSResizeTop = this.handleLineNSResizeTop.bind(this)
    this.handleLineNSResizeBottom = this.handleLineNSResizeBottom.bind(this)
    this.handleLineMove = this.handleLineMove.bind(this)
    this.handleLineDragStart = this.handleLineDragStart.bind(this)
    this.handleHover = this.handleHover.bind(this)

    this.isHover = isHover.bind(this)
    this.saveNodeType = saveNodeType.bind(this)
    this.nodes = {}

    this.state = {
      hover: false
    }

  }

  handleHover (moreProps) {

    if (this.state.hover !== moreProps.hovering) {
      this.setState({
        hover: moreProps.hovering
      })
    }
  }

  handleLineDragStart () {
    const {
      x1, y1, x2, y2
    } = this.props

    this.dragStart = {
      x1, y1, x2, y2
    }
  }

  handleLineMove (moreProps) {
    const {index, onDrag} = this.props

    const {
      x1: x1Value, y1: y1Value, x2: x2Value, y2: y2Value
    } = this.dragStart

    const {xScale, chartConfig: {yScale}, xAccessor, fullData} = moreProps
    const {startPos, mouseXY} = moreProps

    const x1 = xScale(x1Value)
    const y1 = yScale(y1Value)
    const x2 = xScale(x2Value)
    const y2 = yScale(y2Value)

    const dx = startPos[0] - mouseXY[0]
    const dy = startPos[1] - mouseXY[1]

    const newX1Value = getXValue(xScale, xAccessor, [x1 - dx, y1 - dy], fullData)
    const newY1Value = yScale.invert(y1 - dy)
    const newX2Value = getXValue(xScale, xAccessor, [x2 - dx, y2 - dy], fullData)
    const newY2Value = yScale.invert(y2 - dy)

    onDrag(index, {
      x1: newX1Value,
      y1: newY1Value,
      x2: newX2Value,
      y2: newY2Value
    })
  }

  handleLineNSResizeTop (moreProps) {
    const {index, onDrag} = this.props
    const {
      x1, x2, y2
    } = this.props

    const [, y1] = getNewXY(moreProps)

    onDrag(index, {
      x1,
      y1,
      x2,
      y2
    })
  }

  handleLineNSResizeBottom (moreProps) {
    const {index, onDrag} = this.props
    const {
      x1, y1, x2
    } = this.props

    const [, y2] = getNewXY(moreProps)

    onDrag(index, {
      x1,
      y1,
      x2,
      y2
    })
  }

  handleEdge1Drag (moreProps) {
    const {index, onDrag} = this.props
    const {
      y1, x2, y2
    } = this.props

    const [x1] = getNewXY(moreProps)

    onDrag(index, {
      x1,
      y1,
      x2,
      y2
    })
  }

  handleEdge2Drag (moreProps) {
    const {index, onDrag} = this.props
    const {
      x1, y1, y2
    } = this.props

    const [x2] = getNewXY(moreProps)

    onDrag(index, {
      x1,
      y1,
      x2,
      y2
    })
  }

  render () {

    let {candleData, toggle_ruler,  type, side, interactive, appearance, base, comp} = this.props

    const {x1, x2, y1, y2} = this.props

    let {stroke, strokeWidth, strokeOpacity} = appearance
    let {fontFamily, fontSize, fontFill, lineStrokeDasharray} = appearance
    let {edgeStroke, edgeFill, edgeStrokeWidth, r} = appearance

    r = 7
    lineStrokeDasharray = 'ShortDot'
    strokeWidth = 0.15
    edgeStrokeWidth = 0.25
    fontSize = 11
    edgeStroke = '#FFFFFF'

    if (toggle_ruler) {
      r = 5
      type = 'BOUND'
      stroke = '#FF8200'
      edgeFill = '#FF8200'
      fontFill = '#8f8f8f'
    } else {
      if (side === 'buy') {
        stroke = utils.color().side_rgb('buy', 0.65)
        edgeFill = utils.color().side('buy')
        fontFill = utils.color().side('buy')
      } else if (side === 'sell') {
        stroke = utils.color().side_rgb('sell', 0.65)
        edgeFill = utils.color().side('sell')
        fontFill = utils.color().side('sell')
      }
    }

    const fillColor = function (__line) {
      if (__line.percent === 100) {
        return 'rgba(24, 26, 37, ' + (0.80) + ')'
      } else if (__line.percent === 0) {
        return 'rgba(255, 255, 255, ' + (0.80) + ')'
      } else {
        if (side === 'buy') {
          let opacity_fuck_inverse = (1 / __line.percent) * 10
          edgeFill = 'rgba(100, 149, 237, ' + (opacity_fuck_inverse) + ')'
        } else if (side === 'sell') {
          let opacity_fuck_inverse = (1 / __line.percent) * 10
          edgeFill = 'rgba(255, 105, 180, ' + (opacity_fuck_inverse) + ')'
        }
        return edgeFill
      }
    }
    const {hoverText, selected, min_trade_value, slave_buy_risk, slave_sell_risk} = this.props
    const {hover} = this.state
    const {onDragComplete} = this.props
    const {paradigmArray, lotSumArray} = this.props
    const worksheet = this.props.worksheet

    const lines = helper({x1, x2, y1, y2}, worksheet, paradigmArray, lotSumArray, side, min_trade_value, slave_buy_risk, slave_sell_risk)

    const {enable: hoverTextEnabled, ...restHoverTextProps} = hoverText
    const lineType = type === 'EXTEND' ? 'XLINE' : type === 'BOUND' ? 'LINE' : type

    let dir
    if (head(lines)) {
      if (head(lines).y1 > last(lines).y1) {
        dir = 3
      } else {
        dir = -1.3
      }
    }

    const gains = _.map(lines, function (__obj) {
      return __obj.gain
    })

    let netGainsSum = 0

    if (side === 'buy' && slave_buy_risk > 0 || side === 'sell' && slave_sell_risk > 0) {

      netGainsSum = _.sum(gains)

    }


    /** FIB ORDER =====================================================================================================
     * ================================================================================================================
     **/
    const retracements = lines.map((line, j) => {

      function setCurrency (__side) {
        if (__side === 'sell') {
          return base
        } else if (__side === 'buy') {
          return comp
        }
      }

      let net_cost_label = 'net'

      /** LINE TEXT ================================================================================================================================================================================================================================================ */
      let text = ''
      let fee = _.multiply(netGainsSum, .0025)
      let net = _.subtract(netGainsSum, fee)

      if (j === 0) {

        if (side === 'buy' && slave_buy_risk > 0 || side === 'sell' && slave_sell_risk > 0) {
          text = `Δ ${utils.__toFixed(line.percentAboveZero, 2)}%    Total Net:  ${_.toString(utils.__toFixed(net))}`
        } else {
          text = `Δ ${utils.__toFixed(line.percentAboveZero, 2)}%`
        }

      } else {
        // text = `Δ ${utils.__toFixed(line.percentAboveZero, 2)}%    ${net_cost_label + ': '} ${utils.__toFixed(line.gain) + ' ' + setCurrency(side)}`

        if (line.minTradeRequirementMet && side === 'buy' && slave_buy_risk > 0 || line.minTradeRequirementMet && side === 'sell' && slave_sell_risk > 0) {
          text = `Δ ${utils.__toFixed(line.percentAboveZero, 2)}%    ${net_cost_label + ': '} ${utils.__toFixed(line.gain) + ' ' + setCurrency(side)}`
        } else {
          text = `Δ ${utils.__toFixed(line.percentAboveZero, 2)}%`
        }
      }

      const xyProvider = ({xScale, chartConfig}) => {

        const {yScale} = chartConfig

        const {x1, y1, x2} = generateLine({
          type: lineType,
          start: [line.x1, line.y],
          end: [line.x2, line.y],
          xScale,
          yScale
        })

        const x = xScale(Math.min(x1, x2)) + 10
        const y = yScale(y1) + dir * 4
        return [x, y]

      }

      const firstOrLast = (j === 0) || (j === lines.length - 1)

      const interactiveCursorClass = firstOrLast
        ? 'react-stockcharts-ns-resize-cursor'
        : 'react-stockcharts-move-cursor'

      const interactiveEdgeCursorClass = firstOrLast
        ? 'react-stockcharts-ns-resize-cursor'
        : 'react-stockcharts-ew-resize-cursor'

      const dragHandler = j === 0
        ? this.handleLineNSResizeTop
        : j === lines.length - 1
          ? this.handleLineNSResizeBottom
          : this.handleLineMove

      const edge1DragHandler = j === 0
        ? this.handleLineNSResizeTop
        : j === lines.length - 1
          ? this.handleLineNSResizeBottom
          : this.handleEdge1Drag
      const edge2DragHandler = j === 0
        ? this.handleLineNSResizeTop
        : j === lines.length - 1
          ? this.handleLineNSResizeBottom
          : this.handleEdge2Drag

      const hoverHandler = interactive
        ? {onHover: this.handleHover, onUnHover: this.handleHover}
        : {}
      return <g key={j}>

        <StraightLine ref={this.saveNodeType(`line_${j}`)}
                      selected={selected || hover}
                      {...hoverHandler}
                      type={lineType}
                      x1Value={line.x1}
                      y1Value={line.y}
                      x2Value={line.x2}
                      y2Value={line.y}
                      stroke={stroke}
                      strokeWidth={(hover || selected) ? 1 : strokeWidth}
                      strokeOpacity={strokeOpacity}
                      interactiveCursorClass={interactiveCursorClass}
                      onDragStart={this.handleLineDragStart}
                      onDrag={dragHandler}
                      onDragComplete={onDragComplete}
                      strokeDasharray={lineStrokeDasharray}
        />

        <Text selected={selected}
              xyProvider={xyProvider}
              fontFamily={fontFamily}
              fontSize={fontSize}
              fill={fontFill}>
          {text}
        </Text>

        <ClickableCircle ref={this.saveNodeType('edge1')}
                         show={selected || hover}
                         cx={line.x1}
                         cy={line.y}
                         r={r}
                         fill={fillColor(line)}
                         stroke={edgeStroke}
                         strokeWidth={edgeStrokeWidth}
                         interactiveCursorClass={interactiveEdgeCursorClass}
                         onDrag={edge1DragHandler}
                         onDragComplete={onDragComplete}
        />

        <ClickableCircle ref={this.saveNodeType('edge2')}
                         show={selected || hover}
                         cx={line.x2}
                         cy={line.y}
                         r={r}
                         fill={fillColor(line)}
                         stroke={edgeStroke}
                         strokeWidth={edgeStrokeWidth}
                         interactiveCursorClass={interactiveEdgeCursorClass}
                         onDrag={edge2DragHandler}
                         onDragComplete={onDragComplete}
        />

        <HoverTextNearMouse show={hoverTextEnabled && hover && !selected}
                            {...restHoverTextProps}
        />

      </g>
    })

    /** RULER =========================================================================================================
     * ================================================================================================================
     **/
    const ruler = lines.map((line, j) => {

      let length = lines.length
      let start_date
      let end_date

      if (candleData[line.x1]) {
        start_date = candleData[line.x1].timestamp
      } else {
        start_date = undefined
      }

      if (candleData[line.x2]) {
        end_date = candleData[line.x2].timestamp
      } else {
        end_date = undefined
      }

      let date_diff
      let time

      if (start_date && end_date) {
        date_diff = new DateDiff(end_date, start_date)
        time = `${Math.abs(date_diff.days)}d ${Math.abs(date_diff.hours)}h ${Math.abs(date_diff.minutes)}m`
      } else {
        time = '> Today!'
      }

      let text = `Δ ${utils.__toFixed(line.percentAboveZero, 2)}%`
      let text_end

      if (j === length - 1) {
        text_end = time
      } else {
        text_end = ''
      }

      const xyProvider = ({xScale, chartConfig}) => {

        const {yScale} = chartConfig

        const {x1, y1, x2} = generateLine({
          type: lineType,
          start: [line.x1, line.y],
          end: [line.x2, line.y],
          xScale,
          yScale

        })

        const x = xScale(Math.min(x1, x2)) + 10
        const y = yScale(y1) + dir * 4
        return [x, y]

      }

      const xyProviderEnd = ({xScale, chartConfig}) => {

        const {yScale} = chartConfig

        const {x1, y1, x2} = generateLine({
          type: lineType,
          start: [line.x1, line.y],
          end: [line.x2, line.y],
          xScale,
          yScale

        })

        const x = xScale(Math.max(x1, x2)) - 70
        const y = yScale(y1) + dir * 4
        return [x, y]

      }

      const firstOrLast = (j === 0) || (j === lines.length - 1)

      const interactiveCursorClass = firstOrLast
        ? 'react-stockcharts-ns-resize-cursor'
        : 'react-stockcharts-move-cursor'

      const interactiveEdgeCursorClass = firstOrLast
        ? 'react-stockcharts-ns-resize-cursor'
        : 'react-stockcharts-ew-resize-cursor'

      const dragHandler = j === 0
        ? this.handleLineNSResizeTop
        : j === lines.length - 1
          ? this.handleLineNSResizeBottom
          : this.handleLineMove

      const edge1DragHandler = j === 0
        ? this.handleLineNSResizeTop
        : j === lines.length - 1
          ? this.handleLineNSResizeBottom
          : this.handleEdge1Drag
      const edge2DragHandler = j === 0
        ? this.handleLineNSResizeTop
        : j === lines.length - 1
          ? this.handleLineNSResizeBottom
          : this.handleEdge2Drag

      const hoverHandler = interactive
        ? {onHover: this.handleHover, onUnHover: this.handleHover}
        : {}
      return <g key={j}>

        <StraightLine ref={this.saveNodeType(`line_${j}`)}
                      selected={selected || hover}
                      {...hoverHandler}
                      type={lineType}
                      x1Value={line.x1}
                      y1Value={line.y}
                      x2Value={line.x2}
                      y2Value={line.y}
                      stroke={stroke}
                      strokeWidth={(hover || selected) ? 1 : strokeWidth}
                      strokeOpacity={strokeOpacity}
                      interactiveCursorClass={interactiveCursorClass}
                      onDragStart={this.handleLineDragStart}
                      onDrag={dragHandler}
                      onDragComplete={onDragComplete}
                      strokeDasharray={lineStrokeDasharray}
        />

        <Text selected={selected}
              xyProvider={xyProvider}
              fontFamily={fontFamily}
              fontSize={fontSize}
              fill={fontFill}>
          {text}
        </Text>

        <Text selected={selected}
              xyProvider={xyProviderEnd}
              fontFamily={fontFamily}
              fontSize={fontSize}
              fill={fontFill}>
          {text_end}
        </Text>

        <ClickableCircle ref={this.saveNodeType('edge1')}
                         show={selected || hover}
                         cx={line.x1}
                         cy={line.y}
                         r={r}
                         fill={fillColor(line)}
                         stroke={edgeStroke}
                         strokeWidth={edgeStrokeWidth}
                         interactiveCursorClass={interactiveEdgeCursorClass}
                         onDrag={edge1DragHandler}
                         onDragComplete={onDragComplete}
        />

        <ClickableCircle ref={this.saveNodeType('edge2')}
                         show={selected || hover}
                         cx={line.x2}
                         cy={line.y}
                         r={r}
                         fill={fillColor(line)}
                         stroke={edgeStroke}
                         strokeWidth={edgeStrokeWidth}
                         interactiveCursorClass={interactiveEdgeCursorClass}
                         onDrag={edge2DragHandler}
                         onDragComplete={onDragComplete}
        />

        <HoverTextNearMouse show={hoverTextEnabled && hover && !selected}
                            {...restHoverTextProps}
        />

      </g>
    })

    if (toggle_ruler) {
      return (<g>{ruler}</g>)
    } else {
      return (<g>{retracements}</g>)
    }

  }

}

EachFibRetracement.propTypes = {
  x1: PropTypes.any.isRequired,
  x2: PropTypes.any.isRequired,
  y1: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,

  yDisplayFormat: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  lineStrokeDasharray: PropTypes.oneOf(strokeDashTypes),

  appearance: PropTypes.shape({
    stroke: PropTypes.string.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    strokeOpacity: PropTypes.number.isRequired,
    fontFamily: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    fontFill: PropTypes.string.isRequired,
    edgeStroke: PropTypes.string.isRequired,
    edgeFill: PropTypes.string.isRequired,
    nsEdgeFill: PropTypes.string.isRequired,
    edgeStrokeWidth: PropTypes.number.isRequired,
    r: PropTypes.number.isRequired
  }).isRequired,

  interactive: PropTypes.bool.isRequired,
  hoverText: PropTypes.object.isRequired,

  index: PropTypes.number,
  onDrag: PropTypes.func.isRequired,
  onDragComplete: PropTypes.func.isRequired
}

EachFibRetracement.defaultProps = {
  yDisplayFormat: d => d.toFixed(8),
  interactive: true,
  appearance: {
    stroke: '#000000',
    strokeWidth: 0.15,
    strokeOpacity: 1,
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSize: 16,
    fontFill: '#000000',
    edgeStroke: '#000000',
    edgeFill: '#FFFFFF',
    nsEdgeFill: '#000000',
    edgeStrokeWidth: 1,
    r: 6,
    lineStrokeDasharray: 'ShortDash',
  },
  selected: false,
  onDrag: noop,
  onDragComplete: noop,
  hoverText: {
    enable: false
  }
}

function mapStateToProps (state) {
  return {

    candleData: state.chartData.candleData,
    toggle_ruler: state.chartData.toggle_ruler,
    min_trade_value: state.chartData.min_trade_value,
    buy_risk: state.chartData.buy_risk,
    sell_risk: state.chartData.sell_risk,
    slave_buy_risk: state.chartData.slave_buy_risk,
    slave_sell_risk: state.chartData.slave_sell_risk,
    paradigmArray: state.chartData.paradigmArray,
    amountArray: state.chartData.amountArray,
    lotSumArray: state.chartData.lotSumArray,
    netGainsArray: state.chartData.netGainsArray,
    pricesArray: state.chartData.pricesArray,
    lotSum: state.chartData.lotSum,
    side: state.chartData.side,
    base: state.chartData.base,
    comp: state.chartData.comp,
    worksheet: state.chartData.worksheet

  }
}

function mapDispatchToProps (dispatch) {
  return {
    chartDataActions: bindActionCreators(chartDataActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EachFibRetracement)

