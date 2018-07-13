import React from 'react'
import PropTypes from 'prop-types'

import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import { ChartCanvas, Chart } from 'react-stockcharts'
import {
  BarSeries,
  CandlestickSeries,
  LineSeries,
  MACDSeries
} from 'react-stockcharts/lib/series'
import { XAxis, YAxis } from 'react-stockcharts/lib/axes'
import {
  CrossHairCursor,
  EdgeIndicator,
  CurrentCoordinate,
  MouseCoordinateX,
  MouseCoordinateY
} from 'react-stockcharts/lib/coordinates'

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
import {
  OHLCTooltip,
  MovingAverageTooltip,
  MACDTooltip
} from 'react-stockcharts/lib/tooltip'
import { ema, macd } from 'react-stockcharts/lib/indicator'
import { fitWidth } from 'react-stockcharts/lib/helper'

import { EquidistantChannel, DrawingObjectSelector } from './lib/interactive'

import { last, toObject } from 'react-stockcharts/lib/utils'
import {
  saveInteractiveNodes,
  getInteractiveNodes
} from './interactiveutils'

import * as d3 from 'd3'

import _ from 'lodash'

const log = require('ololog').configure({locate: false})

function __pencil (id) {
  
  let line = d3.line()
    .curve(d3.curveBasis)

  let svg = d3.select(id)
    .call(d3.drag()
      .container(function () { return this })
      .subject(function () {
        let p = [d3.event.x, d3.event.y]
        return [p, p]
      })
      .on('start', dragstarted))

  function dragstarted () {
    let d = d3.event.subject,
      active = svg.append('path').datum(d),
      x0 = d3.event.x,
      y0 = d3.event.y

    d3.event.on('drag', function () {
      let x1 = d3.event.x,
        y1 = d3.event.y,
        dx = x1 - x0,
        dy = y1 - y0

      if (dx * dx + dy * dy > 100) d.push([x0 = x1, y0 = y1])
      else d[d.length - 1] = [x1, y1]
      active.attr('d', line)
    })
  }
  
  
}

const macdAppearance = {
  stroke: {
    macd: '#FF0000',
    signal: '#00F300'
  },
  fill: {
    divergence: '#4682B4'
  }
}

class CandleStickChart extends React.Component {
  constructor (props) {
    super(props)
    this.onKeyPress = this.onKeyPress.bind(this)
    this.onDrawComplete = this.onDrawComplete.bind(this)
    this.saveInteractiveNode = this.saveInteractiveNode.bind(this)
    this.saveCanvasNode = this.saveCanvasNode.bind(this)
    this.handleSelection = this.handleSelection.bind(this)

    this.saveInteractiveNodes = saveInteractiveNodes.bind(this)
    this.getInteractiveNodes = getInteractiveNodes.bind(this)

    this.state = {
      enableInteractiveObject: true,
      channels_1: [],
      channels_3: [],
      chartHeight: 1200,
    }
  }

  saveInteractiveNode (node) {
    this.node = node
  }

  saveCanvasNode (node) {
    this.canvasNode = node
  }

  componentDidMount () {
    document.addEventListener('keyup', this.onKeyPress)

    const chartHeight = document.getElementById('chart').clientHeight

    this.setState({
      chartHeight: chartHeight
    })

  }

  componentWillUnmount () {
    document.removeEventListener('keyup', this.onKeyPress)
  }

  handleSelection (interactives) {
    const state = toObject(interactives, each => {
      return [
        `channels_${each.chartId}`,
        each.objects
      ]
    })
    this.setState(state)
  }

  onDrawComplete (channels_1) {
    // this gets called on
    // 1. draw complete of drawing object
    // 2. drag complete of drawing object
    this.setState({
      enableInteractiveObject: false,
      channels_1
    })
  }

  onKeyPress (e) {
    const keyCode = e.which
    console.log(keyCode)
    switch (keyCode) {

      case 8: // DEL Macbook Pro
      case 46: { // DEL PC

        const channels_1 = this.state.channels_1
          .filter(each => !each.selected)
        const channels_3 = this.state.channels_3
          .filter(each => !each.selected)

        this.canvasNode.cancelDrag()
        this.setState({
          channels_1,
          channels_3
        })
        break
      }
      case 27: { // ESC
        this.node.terminate()
        this.canvasNode.cancelDrag()

        this.setState({
          enableInteractiveObject: false
        })
        break
      }
      case 68:   // D - Draw drawing object
      case 69: { // E - Enable drawing object
        this.setState({
          enableInteractiveObject: true
        })
        break
      }
    }
  }

  render () {
    const ema26 = ema()
      .id(0)
      .options({windowSize: 26})
      .merge((d, c) => { d.ema26 = c })
      .accessor(d => d.ema26)

    const ema12 = ema()
      .id(1)
      .options({windowSize: 12})
      .merge((d, c) => {d.ema12 = c})
      .accessor(d => d.ema12)

    const macdCalculator = macd()
      .options({
        fast: 12,
        slow: 26,
        signal: 9
      })
      .merge((d, c) => {d.macd = c})
      .accessor(d => d.macd)

    const {type, data: initialData, width, ratio} = this.props
    const {channels_1, channels_3} = this.state

    const calculatedData = macdCalculator(ema12(ema26(initialData)))
    const xScaleProvider = discontinuousTimeScaleProvider
      .inputDateAccessor(d => d.date)
    const {
      data,
      xScale,
      xAccessor,
      displayXAccessor
    } = xScaleProvider(calculatedData)

    const start = xAccessor(last(data))
    const end = xAccessor(data[Math.max(0, data.length - 150)])
    const xExtents = [start, end]

    let bottom_padding = 56

		return (
			<ChartCanvas ref={this.saveCanvasNode}
				height={this.state.chartHeight - bottom_padding}
				width={width}
				ratio={ratio}
				margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
				type={type}
				seriesName='Balls'
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}>

				<Chart id={1}
               height={this.state.chartHeight - bottom_padding}
               yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
               padding={{ top: 10, bottom: 20 }} >

          <XAxis axisAt='bottom' orient='bottom' showTicks={false} outerTickSize={0} />
					<YAxis axisAt='right' orient='right' ticks={5} />

          <MouseCoordinateY at='right' orient='right' displayFormat={format('.2f')} />

					<CandlestickSeries />
					<LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()} />
					<LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()} />

					<CurrentCoordinate yAccessor={ema26.accessor()} fill={ema26.stroke()} />
					<CurrentCoordinate yAccessor={ema12.accessor()} fill={ema12.stroke()} />

          <EdgeIndicator itemType='last'
                         orient='right'
                         edgeAt='right'
                         yAccessor={d => d.close} fill={d => d.close > d.open ? '#6BA583' : '#FF0000'} />




					<EquidistantChannel ref={this.saveInteractiveNodes('EquidistantChannel', 1)}
                              enabled={this.state.enableInteractiveObject}
                              onStart={() => console.log('START')}
                              onComplete={this.onDrawComplete}
                              channels={channels_1} />



				</Chart>

				<CrossHairCursor />
        
				<DrawingObjectSelector enabled={!this.state.enableInteractiveObject}
                               getInteractiveNodes={this.getInteractiveNodes}
                               onSelect={this.handleSelection}
                               drawingObjectMap={{
                                 EquidistantChannel: 'channels'
                               }} />
			</ChartCanvas>
		)
	}
}

CandleStickChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
}

CandleStickChart.defaultProps = {
	type: 'svg',
}

CandleStickChart = fitWidth(CandleStickChart)

export default CandleStickChart
