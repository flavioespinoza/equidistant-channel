'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { drawOnCanvas, renderSVG } from './EdgeCoordinateV3'
import GenericChartComponent from '../GenericChartComponent'
import { getAxisCanvas } from '../GenericComponent'
import { functor, strokeDashTypes } from '../utils'
import _ from 'lodash'

function helper (props, moreProps) {
  const text = props.text
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

  // const coordinate = displayFormat(yScale.invert(y));
  const coordinate = text
  const hideLine = false

  const coordinateProps = {
    text,
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
    x1: x1 + props.x1_Offset,
    x2: x2 + props.x2_Offset,
    y1: y,
    y2: y
  }
  return coordinateProps
}

class PriceCoordinate extends Component {
  constructor (props) {
    super(props)
    this.renderSVG = this.renderSVG.bind(this)
    this.drawOnCanvas = this.drawOnCanvas.bind(this)
  }

  drawOnCanvas (ctx, moreProps) {
    const props = helper(this.props, moreProps)
    drawOnCanvas(ctx, props)
  }

  renderSVG (moreProps) {
    const props = helper(this.props, moreProps)
    return renderSVG(props)
  }

  render () {
    return <GenericChartComponent clip={false}
                                  onClick={this.handleClick}
                                  svgDraw={this.renderSVG}
                                  canvasDraw={this.drawOnCanvas}
                                  canvasToDraw={getAxisCanvas}
                                  drawOn={['pan']}/>
  }
}

PriceCoordinate.propTypes = {
  x1_Offset: PropTypes.number,
  x2_Offset: PropTypes.number,
  displayFormat: PropTypes.func.isRequired,
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
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  textFill: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  lineStrokeDasharray: PropTypes.oneOf(strokeDashTypes)
}

PriceCoordinate.defaultProps = {
  x1_Offset: 0,
  x2_Offset: 0,
  yAxisPad: 0,
  rectWidth: 100,
  rectHeight: 20,
  orient: 'left',
  at: 'left',
  price: 0,
  dx: 0,
  arrowWidth: 12,
  fill: '#BAB8b8',
  opacity: 1,
  lineOpacity: 0.15,
  lineStroke: '#bbbed4',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  fontSize: 12,
  textFill: '#FFFFFF',
  lineStrokeDasharray: 'ShortDash'
}

export default PriceCoordinate
