import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { drawOnCanvas, renderSVG } from './EdgeCoordinateV3'
import GenericChartComponent from '../GenericChartComponent'
import PriceCoordinate from './PriceCoordinate'
import { getAxisCanvas } from '../GenericComponent'
import { functor, strokeDashTypes } from '../utils'

import * as utils from '../../utils'

import _ from 'lodash'
import { format } from 'd3-format'
import store from '../../Store'

const color = utils.color()
const log = require('ololog').configure({
  locate: false
})

function helper (props, moreProps, __base) {
  const {width} = moreProps
  const {chartConfig: {yScale}} = moreProps
  const lowerPrice = yScale.domain()[0]
  const upperPrice = yScale.domain()[1]
  const lowerYValue = yScale.range()[0]
  const upperYValue = yScale.range()[1]
  const rangeSlope = (lowerPrice - upperPrice) / (lowerYValue - upperYValue)

  const {orient, at, rectWidth, rectHeight, displayFormat, dx, price} = props
  const {fill, opacity, fontFamily, fontSize, textFill, arrowWidth, lineOpacity, lineStroke, lineStrokeDasharray} = props

  const x1 = 0, x2 = width
  const edgeAt = (at === 'right')
    ? width
    : 0

  const type = 'horizontal'
  const priceShowTolerance = 5

  let y = 0
  let show

  if (price < (upperPrice + priceShowTolerance)
    || price > (lowerPrice - priceShowTolerance)) {
    y = (price / rangeSlope) + (lowerYValue - (lowerPrice / rangeSlope))
    show = true
  } else {
    show = false
  }

  const coordinate = yScale.invert(y)
  const hideLine = false

  const coordinateProps = {
    coordinate,
    show,
    type,
    orient,
    edgeAt,
    hideLine,
    lineOpacity,
    lineStroke,
    lineStrokeDasharray,
    fill: functor(fill)(price),
    textFill: functor(textFill)(price),
    opacity, fontFamily, fontSize,
    rectWidth,
    rectHeight,
    arrowWidth,
    dx,
    x1,
    x2,
    y1: y,
    y2: y
  }
  return coordinateProps
}

class OpenOrderMarker extends Component {
  constructor (props) {
    super(props)
    this.renderSVG = this.renderSVG.bind(this)
    this.drawOnCanvas = this.drawOnCanvas.bind(this)
  }

  drawOnCanvas (ctx, moreProps) {
    const base = this.props.base
    const props = helper(this.props, moreProps, base)
    drawOnCanvas(ctx, props)
  }

  renderSVG (moreProps) {
    const base = this.props.base
    const props = helper(this.props, moreProps, base)
    return renderSVG(props)
  }

  render () {

    const openOrders = this.props.openOrders
    const base = this.props.base
    const comp = this.props.comp
    const lineOpacity = this.props.lineOpacity
    const opacity = this.props.opacity
    const side = this.props.side
    const rectHeight = this.props.rectHeight
    const fontSize = this.props.fontSize

    const __state = store.getState()
    const order_selected = __state.chartData.orderSelected

    let __openOrders

    if (side === 'buy') {
      __openOrders = _.filter(openOrders, function (__obj) {
        return __obj.side === 'buy'
      })
    } else if (side === 'sell') {
      __openOrders = _.filter(openOrders, function (__obj) {
        return __obj.side === 'sell'
      })
    } else {
      __openOrders = openOrders
    }

    const __open_orders = __openOrders.map(function (__obj) {

      let text = utils.__toFixed(__obj.amount, null, 2, 8) + '  @  ' + utils.__toFixed(__obj.price, null, 2, 8)
      // let text = utils.__toFixed(__obj.amount, 5)

      let fillColor
      let lineStroke
      let opacity
      // let lineOpacity

      // if (__obj.OrderUuid === __state.chartData.orderSelected || __obj.selected) {
      if (__obj.id === order_selected) {
        fillColor = '#FF8200'
        lineStroke = '#FF8200'
        opacity = 0.60
        // lineOpacity = 0.60
      } else {
        fillColor = color.side(__obj.side)
        lineStroke = color.side(__obj.side)
        opacity = 0.50
        // lineOpacity = 0.50
      }

      if (__obj.filled > 0) {
        opacity = 1
        // lineOpacity = 1
        text = utils.__toFixed(__obj.filled, null, 2, 8) + ' / ' + utils.__toFixed(__obj.amount, null, 2, 8)
      }

      return (<PriceCoordinate id={__obj.id}
                               className={'open-order-marker'}
                               key={__obj.id}
                               rectHeight={rectHeight}
                               at="right"
                               orient="left"
                               dx={-112}
                               lineStroke={lineStroke}
                               fill={fillColor}
                               opacity={opacity}
                               lineOpacity={lineOpacity}
                               fontSize={fontSize}
                               price={__obj.price}
                               text={text}
                               lineStrokeDasharray={'ShortDot'}
                               displayFormat={format(utils.currencyFormat(base))}/>)
    })

    return (

      <g>

        {__open_orders}

        <GenericChartComponent clip={false}
                               svgDraw={this.renderSVG}
                               canvasDraw={this.drawOnCanvas}
                               canvasToDraw={getAxisCanvas}
                               drawOn={['mousemove', 'pan']}/>

      </g>

    )
  }

}

OpenOrderMarker.propTypes = {
  side: PropTypes.string.isRequired,
  displayFormat: PropTypes.func,
  yAxisPad: PropTypes.number,
  rectWidth: PropTypes.number,
  rectHeight: PropTypes.number,
  orient: PropTypes.oneOf(['bottom', 'top', 'left', 'right']),
  at: PropTypes.oneOf(['bottom', 'top', 'left', 'right']),
  price: PropTypes.number,
  dx: PropTypes.number,
  arrowWidth: PropTypes.number,
  opacity: PropTypes.number,
  lineOpacity: PropTypes.number,
  lineStroke: PropTypes.string,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  fill: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  textFill: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  lineStrokeDasharray: PropTypes.oneOf(strokeDashTypes)
}

OpenOrderMarker.defaultProps = {
  yAxisPad: 0,
  rectWidth: 66,
  rectHeight: 255,
  orient: 'left',
  at: 'left',
  price: 0,
  dx: 0,
  arrowWidth: 12,
  fill: '#BAB8b8',
  opacity: 1,
  lineOpacity: 1,
  lineStroke: '#000000',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  fontSize: 11,
  textFill: '#FFFFFF',
  lineStrokeDasharray: 'ShortDash'
}

export default OpenOrderMarker
