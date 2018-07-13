'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ascending, descending, sum, max, merge, zip, histogram as d3Histogram } from 'd3-array'
import { nest } from 'd3-collection'
import { scaleLinear } from 'd3-scale'

import GenericChartComponent from '../GenericChartComponent'
import { getAxisCanvas } from '../GenericComponent'

import { head, last, hexToRGBA, accumulatingWindow, identity, functor } from '../utils'
import * as utils from '../../utils'
import _ from 'lodash'

const log = require('ololog').configure({
  locate: false
})

class VerticalDepthChart extends Component {
  constructor (props) {
    super(props)
    this.renderSVG = this.renderSVG.bind(this)
    this.drawOnCanvas = this.drawOnCanvas.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  drawOnCanvas (ctx, moreProps) {

    const {xAccessor, width} = moreProps
    const {rects, sessionBg} = helper(this.props, moreProps, xAccessor, width)

    drawOnCanvas(ctx, this.props, rects, sessionBg)
  }

  handleClick (e) {
    log.blue(e.target)
  }

  render () {

    return (<GenericChartComponent svgDraw={this.renderSVG}
                                   canvasDraw={this.drawOnCanvas}
                                   canvasToDraw={getAxisCanvas}
                                   drawOn={['pan']}/>)
  }

  renderSVG (moreProps) {

    const {className, opacity} = this.props

    const {showSessionBackground, sessionBackGround, sessionBackGroundOpacity} = this.props

    const {xAccessor, width} = moreProps
    const {rects, sessionBg} = helper(this.props, moreProps, xAccessor, width)

    const sessionBgSvg = showSessionBackground
      ? sessionBg.map((d, idx) => <rect key={idx} {...d} opacity={sessionBackGroundOpacity} fill={sessionBackGround}/>)
      : null

    return <g className={className}
              onClick={this.handleClick}>
      {sessionBgSvg}
      {rects.map((d, i) => <g key={i} onClick={this.handleClick}>
        <rect x={d.x} y={d.y}
              onClick={this.handleClick}
              width={d.w1} height={d.height}
              fill={d.fill1} stroke={d.stroke1} fillOpacity={opacity}/>
        <rect x={d.x + d.w1} y={d.y}
              onClick={this.handleClick}
              width={d.w2} height={d.height}
              fill={d.fill2} stroke={d.stroke2} fillOpacity={opacity}/>

      </g>)}
    </g>
  }
}

VerticalDepthChart.propTypes = {
  className: PropTypes.string,
  opacity: PropTypes.number,
  showSessionBackground: PropTypes.bool,
  sessionBackGround: PropTypes.string,
  sessionBackGroundOpacity: PropTypes.number
}

VerticalDepthChart.defaultProps = {
  opacity: 0.5,
  className: 'line ',
  bins: 20,
  maxProfileWidthPercent: 50,
  source: d => d.close,
  volume: d => d.volume,
  absoluteChange: d => d.absoluteChange,
  bySession: false,
  /* eslint-disable no-unused-vars */
  sessionStart: ({d, i, plotData}) => d.idx.startOfMonth,
  /* eslint-enable no-unused-vars */
  orient: 'left',
  fill: ({type}) => type === 'up' ? '#6BA583' : '#FF0000',
  // // fill: ({ type }) => { var c = type === "up" ? "#6BA583" : "#FF0000"; console.log(type, c); return c },
  // stroke: ({ type }) =>  type === "up" ? "#6BA583" : "#FF0000",
  // stroke: "none",
  stroke: '#FFFFFF',
  showSessionBackground: false,
  sessionBackGround: '#4682B4',
  sessionBackGroundOpacity: 0.3,
  partialStartOK: false,
  partialEndOK: true
}

function helper (props, moreProps, xAccessor, width) {

  const {xScale: realXScale, chartConfig: {yScale}, plotData} = moreProps
  const {sessionStart, bySession, partialStartOK, partialEndOK} = props
  const {bins, maxProfileWidthPercent, source, volume, absoluteChange, orient, fill, stroke} = props

  const {orderBook, xScaleFactor, rectVerticalWidth, rectOpacity} = props

  const x_scale_factor = xScaleFactor
  const rect_vertical_width = rectVerticalWidth
  const rect_opacity = rectOpacity

  const sessionBuilder = accumulatingWindow()
    .discardTillStart(!partialStartOK)
    .discardTillEnd(!partialEndOK)
    .accumulateTill((d, i) => {
      return sessionStart({d, i, plotData})
    })
    .accumulator(identity)

  const dx = plotData.length > 1 ? realXScale(xAccessor(plotData[1])) - realXScale(xAccessor(head(plotData))) : 0

  const sessions = bySession ? sessionBuilder(plotData) : [plotData]

  const allRects = sessions.map(session => {

    const begin = bySession ? realXScale(xAccessor(head(session))) : 0
    const finish = bySession ? realXScale(xAccessor(last(session))) : width
    const sessionWidth = finish - begin + dx

    // console.log(session)

    /* var histogram = d3.layout.histogram()
        .value(source)
        .bins(bins);*/

    const histogram2 = d3Histogram()
    // .domain(xScale.domain())
      .value(source)
      .thresholds(bins)

    // console.log(bins, histogram(session))
    // console.log(bins, histogram2(session))
    const rollup = nest()
      .key(d => d.direction)
      .sortKeys(orient === 'right' ? descending : ascending)
      .rollup(leaves => sum(leaves, d => d.volume))

    const values = histogram2(session)
    // console.log("values", values)

    const volumeInBins = values
      .map(arr => arr.map(d => absoluteChange(d) > 0 ? {direction: 'up', volume: volume(d)} : {
        direction: 'down',
        volume: volume(d)
      }))
      .map(arr => rollup.entries(arr))

    // console.log("volumeInBins", volumeInBins)
    const volumeValues = volumeInBins
      .map(each => sum(each.map(d => d.value)))

    // console.log("volumeValues", volumeValues)
    const base = xScale => head(xScale.range())

    const [start, end] = orient === 'right'
      ? [begin, begin + sessionWidth * maxProfileWidthPercent / 100]
      : [finish, finish - sessionWidth * (100 - maxProfileWidthPercent) / 100]

    const xScale = scaleLinear()
      .domain([3000, 0])
      .range([end, start])

    // console.log(xScale.domain())

    const totalVolumes = volumeInBins.map(volumes => {

      const totalVolume = sum(volumes, d => d.value)
      const totalVolumeX = xScale(totalVolume)
      const width = base(xScale) - totalVolumeX
      const x = width < 0 ? totalVolumeX + width : totalVolumeX

      const ws = volumes.map(d => {
        return {
          type: d.key,
          width: d.value * Math.abs(width) / totalVolume
        }
      })

      return {x, ws, totalVolumeX}
    })
    // console.log("totalVolumes", totalVolumes)

    const rect_model = {
      'y': 833.0160358114234,
      'height': -16.2884251554201,
      'x': 324.06281279441265,
      'width': 329,
      'w1': 4.93718720558735,
      'w2': 0,
      'stroke1': '#FFFFFF',
      'stroke2': '#FFFFFF',
      'fill1': '#FF0000',
      'fill2': '#FF0000'
    }

    let all_orders = [...orderBook.asks, ...orderBook.bids]

    const rects = all_orders.map(function (obj, idx) {

      let x_width = (obj.Q + 10) * x_scale_factor
      let y_offset = rect_vertical_width / 2
      let y_position = yScale(obj.R) - y_offset
      let stroke_opacity = _.round(rect_opacity + 0.02, 2)
      let bar_thickness = rect_vertical_width

      return {
        'y': y_position,
        'height': bar_thickness,
        'x': xScale(x_width),
        // 'width': 420,
        'w1': obj.Q,
        'w2': 0,
        'side': obj.side,
        'stroke1': utils.color().side_rgb(obj.side, stroke_opacity),
        'stroke2': utils.color().side_rgb(obj.side, stroke_opacity),
        'fill1': utils.color().side_rgb(obj.side, rect_opacity),
        'fill2': utils.color().side_rgb(obj.side, rect_opacity),
        'opacity': rect_opacity,
      }

    })

    const other_rects = zip(values, totalVolumes)
      .map(([d, {x, ws}]) => {
        const w1 = ws[0] || {type: 'down', width: 0}
        const w2 = ws[1] || {type: 'up', width: 0}

        // console.log(d)
        // console.log(d.x1)
        // console.log(w1)
        // console.log(w2)
        return {

          y: yScale(d.x1),
          // height: yScale(d.x1) - yScale(d.x0),
          height: -12,
          // x: 900,
          x,
          width: 899,
          w1: w1.width,
          w2: w2.width,
          stroke1: functor(stroke)(w1),
          stroke2: functor(stroke)(w2),
          fill1: functor(fill)(w1),
          fill2: functor(fill)(w2)
        }
      })

    // console.log(JSON.stringify(rects[0], null, 2))
    // console.log(rects[5])

    const sessionBg = {
      x: 0,
      y: last(rects).y,
      height: head(rects).y - last(rects).y + head(rects).height,
      width: 500
    }

    return {rects, sessionBg}
  })

  return {
    rects: merge(allRects.map(d => d.rects)),
    sessionBg: allRects.map(d => d.sessionBg)
  }
}

function drawOnCanvas (ctx, props, rects, sessionBg) {

  const ctx_model = {
    fillStyle: "rgba(255, 105, 180, 0.4)",
    filter: "none",
    font: "10px sans-serif",
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "low",
    lineCap: "butt",
    lineDashOffset: 0,
    lineJoin: "miter",
    lineWidth: 1,
    miterLimit: 10,
    shadowBlur: 0,
    shadowColor: "rgba(0, 0, 0, 0)",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    strokeStyle: "rgba(255, 105, 180, 0.415686274509804)",
    text: "FOO",
    textAlign: "start",
    textBaseline: "alphabetic"
  }

  rects.forEach(each => {

    const {x, y, height, w1, w2, stroke1, stroke2, side, opacity} = each

    /** ACTUAL ORDERS - BAR CHART */
    if (w1 > 0) {

      // log.blue('w1')

      ctx.fillStyle = utils.color().side_rgb(side, opacity)


      if (stroke1 !== 'none') ctx.strokeStyle = stroke1

      ctx.beginPath()
      ctx.rect(x, y, w1, height)
      ctx.closePath()
      ctx.fill()
      ctx.text = 'FOO'

      if (stroke1 !== 'none') ctx.stroke()

    }

    /** MARKET DEPTH - AREA CHART */
    if (w2 > 0) {

      log.red('w2')

      ctx.fillStyle = utils.color().side_rgb(side, opacity)

      if (stroke2 !== 'none') ctx.strokeStyle = stroke2

      ctx.beginPath()
      ctx.rect(x + w1, y, w2, height)
      ctx.closePath()
      ctx.fill()

      ctx.text = 'BAR'

      if (stroke2 !== 'none') ctx.stroke()
    }

  })
}

export default VerticalDepthChart
