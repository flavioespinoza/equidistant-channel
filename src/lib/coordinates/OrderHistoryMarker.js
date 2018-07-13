'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { drawOnCanvas, renderSVG } from './EdgeCoordinateV3'
import GenericChartComponent from '../GenericChartComponent'
import PriceCoordinate from './PriceCoordinate'
import { getAxisCanvas } from '../GenericComponent'
import { getMouseCanvas } from '../GenericComponent'
import { functor, strokeDashTypes } from '../utils'
import { isDefined, noop } from '../utils'

import store from '../../Store'

import * as utils from '../../utils'
import _ from 'lodash'

import {
  Label,
  Annotate,
  LabelAnnotation,
  SvgPathAnnotation,
  buyPath,
  sellPath
} from '../annotation'

import { format } from 'd3-format'
import { setOrderHistory } from '../../actions/chartDataActions'
import ClickableCircle from '../interactive/components/ClickableCircle'
import Chance from 'chance'

const chance = new Chance()
const log = require('ololog').configure({
  locate: false
})
const color = utils.color()

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

class OrderHistoryMarker extends Component {
  constructor (props) {
    super(props)
    this.renderSVG = this.renderSVG.bind(this)
    this.drawOnCanvas = this.drawOnCanvas.bind(this)
    this.setOrderInfo = this.setOrderInfo.bind(this)

    this.state = {
      buyFill: '#6495ED'
    }

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

  setOrderInfo (__order) {

    store.dispatch({type: 'SET_ORDER_INFO', payload: __order})
    store.dispatch({type: 'SET_ORDER_SELECTED', payload: __order.id})

  }

  render () {

    const __self = this
    const actions = this.props.chartDataActions
    const orderHistory = this.props.orderHistory
    const base = this.props.base
    const comp = this.props.comp
    const selected = this.props.selected

    const __buy_orderHistory = _.filter(orderHistory, function (__obj) {
      return __obj.side === 'buy'
    })
    const __sell_orderHistory = _.filter(orderHistory, function (__obj) {
      return __obj.side === 'sell'
    })

    const __state = store.getState()

    const buyOrderHistory = __buy_orderHistory.map(function (__obj, __idx) {

      const buyOrderInfo = __obj

      let orderFill = '#6495ED'
      let orderOpacity = 0.05

      if (__obj.id === __state.chartData.orderSelected) {
        orderFill = '#ff8200'
        orderOpacity = 1
      } else {
        orderFill = '#6495ED'
        orderOpacity = 0.50
      }

      let guid = chance.guid()

      return (<Annotate with={SvgPathAnnotation}
                        opacity={0.75}
                        key={guid}
                        id={__obj.id}
                        when={d => d.long === 'LONG' && d.index === __obj.index}
                        usingProps={{
                                    y: function y (_ref) {
                                      const yScale = _ref.yScale
                                      const datum = _ref.datum
                                      return yScale(__obj.average)
                                    },
                                    fill: orderFill,
                                    stroke: '#FFFFFF',
                                    strokeWidth: 3,
                                    opacity: orderOpacity,
                                    path: buyPath,
                                    tooltip: 'BUY',
                                    onClick: function () {
                                      __self.setOrderInfo(__obj)
                                    }
                                  }}/>)
    })

    /** SELL ORDER HISTORY ================================================ */

    const sellOrderHistory = __sell_orderHistory.map(function (__obj, __idx) {

      let orderFill = '#FF69B4'
      let orderOpacity = 0.05

      if (__obj.id === __state.chartData.orderSelected) {
        orderFill = '#ff8200'
        orderOpacity = 1
      } else {
        orderFill = '#FF69B4'
        orderOpacity = 0.50
      }

      let guid = chance.guid()

      return (<Annotate with={SvgPathAnnotation}
                        opacity={0.75}
                        key={guid}
                        when={d => d.short === 'SHORT' && d.index === __obj.index}
                        usingProps={{
                          y: function y (_ref) {
                            const yScale = _ref.yScale
                            const datum = _ref.datum
                            return yScale(__obj.average)
                          },
                          fill: orderFill,
                          stroke: '#FFFFFF',
                          strokeWidth: 3,
                          opacity: orderOpacity,
                          path: sellPath,
                          tooltip: 'SELL',
                          onDoubleClick: (function (){
                            alert('clicked')
                          }),
                          onClick: (function () {
                            __self.setOrderInfo(__obj)
                          })
                        }}/>)

    })

    if (this.props.side === 'buy') {
      return (
        <g>

          {buyOrderHistory}

          <GenericChartComponent clip={false}
                                 svgDraw={this.renderSVG}
                                 canvasDraw={this.drawOnCanvas}
                                 canvasToDraw={getAxisCanvas}
                                 drawOn={['mousemove', 'pan']}/>
        </g>
      )
    }

    if (this.props.side === 'sell') {
      return (
        <g>

          {sellOrderHistory}

          <GenericChartComponent clip={false}
                                 svgDraw={this.renderSVG}
                                 canvasDraw={this.drawOnCanvas}
                                 canvasToDraw={getAxisCanvas}
                                 drawOn={['mousemove', 'pan']}/>
        </g>
      )
    }

  }

}

OrderHistoryMarker.propTypes = {
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

OrderHistoryMarker.defaultProps = {
  yAxisPad: 0,
  rectWidth: 100,
  rectHeight: 40,
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
  fontSize: 12,
  textFill: '#FFFFFF',
  lineStrokeDasharray: 'ShortDash'
}

export default OrderHistoryMarker