import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { pairs } from 'd3-array'
import { path as d3Path } from 'd3-path'

import GenericChartComponent from '../../GenericChartComponent'
import { getMouseCanvas } from '../../GenericComponent'
import { generateLine, isHovering2 } from './StraightLine'

import {
  isDefined, isNotDefined,
  noop, hexToRGBA
} from '../../utils'

const log = require('ololog').configure({locate: false})

class GannFan extends Component {
  constructor (props) {
    super(props)

    this.renderSVG = this.renderSVG.bind(this)
    this.drawOnCanvas = this.drawOnCanvas.bind(this)
    this.isHover = this.isHover.bind(this)
  }

  isHover (moreProps) {
    const {tolerance, onHover} = this.props
    const {mouseXY} = moreProps
    const [mouseX, mouseY] = mouseXY

    let hovering = false
    if (isDefined(onHover)) {

      const lines = helper(this.props, moreProps)

      for (let i = 0; i < lines.length; i++) {
        const line1 = lines[i]

        const left = Math.min(line1.x1, line1.x2)
        const right = Math.max(line1.x1, line1.x2)
        const top = Math.min(line1.y1, line1.y2)
        const bottom = Math.max(line1.y1, line1.y2)

        const isWithinLineBounds = mouseX >= left && mouseX <= right
          && mouseY >= top && mouseY <= bottom

        hovering = isWithinLineBounds
          && isHovering2(
            [line1.x1, line1.y1],
            [line1.x2, line1.y2],
            mouseXY,
            tolerance)

        if (hovering) break
      }
    }
    return hovering
  }

  drawOnCanvas (ctx, moreProps) {
    const {
      stroke, strokeWidth, strokeOpacity,
      fill, fillOpacity,
      fontFamily, fontSize, fontFill
    } = this.props

    const lines = helper(this.props, moreProps)

    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = hexToRGBA(stroke, strokeOpacity)

    ctx.font = `${ fontSize }px ${fontFamily}`
    ctx.fillStyle = fontFill

    lines.forEach(line => {
      const {
        x1, y1, x2, y2, label
      } = line

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      ctx.beginPath()
      ctx.fillText(label.text, label.x, label.y)

    })
    const pairsOfLines = pairs(lines)

    pairsOfLines.forEach(([line1, line2], idx) => {
      ctx.fillStyle = hexToRGBA(fill[idx], fillOpacity)

      ctx.beginPath()
      ctx.moveTo(line1.x1, line1.y1)
      ctx.lineTo(line1.x2, line1.y2)
      ctx.lineTo(line2.x2, line2.y2)
      ctx.closePath()
      ctx.fill()
    })
  }


	renderSVG(moreProps) {

    const { stroke, strokeWidth, fillOpacity, fill, strokeOpacity } = this.props

		const lines = helper(this.props, moreProps);
		const pairsOfLines = pairs(lines);

		const path_lines = pairsOfLines.map(([line1, line2], idx) => {

		  const ctx = d3Path()

      ctx.moveTo(line1.x1, line1.y1)

      ctx.lineTo(line1.x2, line1.y2)
      ctx.lineTo(line2.x2, line2.y2)

      ctx.closePath()

      let dd = 'M568.0078125,147.0078125L568.0078125,147.17447916666666C568.0078125,147.34114583333334,568.0078125,147.67447916666666,566.6744791666666,150.17447916666666C565.3411458333334,152.67447916666666,562.6744791666666,157.34114583333334,559.5078125,163.34114583333334C556.3411458333334,169.34114583333334,552.6744791666666,176.67447916666666,549.8411458333334,183.17447916666666C547.0078125,189.67447916666666,545.0078125,195.34114583333334,542.6744791666666,202.34114583333334C540.3411458333334,209.34114583333334,537.6744791666666,217.67447916666666,535.3411458333334,225.5078125C533.0078125,233.34114583333334,531.0078125,240.67447916666666,529.1744791666666,247.67447916666666C527.3411458333334,254.67447916666666,525.6744791666666,261.3411458333333,525.8411458333334,265.0078125C526.0078125,268.6744791666667,528.0078125,269.3411458333333,532.5078125,268.3411458333333C537.0078125,267.3411458333333,544.0078125,264.6744791666667,551.1744791666666,262.1744791666667C558.3411458333334,259.6744791666667,565.6744791666666,257.3411458333333,573.8411458333334,254.84114583333334C582.0078125,252.34114583333334,591.0078125,249.67447916666666,599.3411458333334,247.84114583333334C607.6744791666666,246.0078125,615.3411458333334,245.0078125,621.3411458333334,244.17447916666666C627.3411458333334,243.34114583333334,631.6744791666666,242.67447916666666,637.1744791666666,242.34114583333334C642.6744791666666,242.0078125,649.3411458333334,242.0078125,653.5078125,242.34114583333334C657.6744791666666,242.67447916666666,659.3411458333334,243.34114583333334,658.3411458333334,245.84114583333334C657.3411458333334,248.34114583333334,653.6744791666666,252.67447916666666,646.0078125,260.3411458333333C638.3411458333334,268.0078125,626.6744791666666,279.0078125,612.0078125,291.6744791666667C597.3411458333334,304.3411458333333,579.6744791666666,318.6744791666667,558.8411458333334,333.6744791666667C538.0078125,348.6744791666667,514.0078125,364.3411458333333,492.6744791666667,375.8411458333333C471.3411458333333,387.3411458333333,452.6744791666667,394.6744791666667,432.5078125,400.1744791666667C412.3411458333333,405.6744791666667,390.6744791666667,409.3411458333333,373.8411458333333,411.5078125C357.0078125,413.6744791666667,345.0078125,414.3411458333333,334.8411458333333,413.3411458333333C324.6744791666667,412.3411458333333,316.3411458333333,409.6744791666667,309.8411458333333,405.8411458333333C303.3411458333333,402.0078125,298.6744791666667,397.0078125,295.6744791666667,392.6744791666667C292.6744791666667,388.3411458333333,291.3411458333333,384.6744791666667,290.6744791666667,381.1744791666667C290.0078125,377.6744791666667,290.0078125,374.3411458333333,290.0078125,370.6744791666667C290.0078125,367.0078125,290.0078125,363.0078125,290.0078125,357.6744791666667C290.0078125,352.3411458333333,290.0078125,345.6744791666667,290.3411458333333,336.5078125C290.6744791666667,327.3411458333333,291.3411458333333,315.6744791666667,292.3411458333333,305.5078125C293.3411458333333,295.3411458333333,294.6744791666667,286.6744791666667,295.8411458333333,279.6744791666667C297.0078125,272.6744791666667,298.0078125,267.3411458333333,299.3411458333333,261.6744791666667C300.6744791666667,256.0078125,302.3411458333333,250.0078125,304.6744791666667,245.34114583333334C307.0078125,240.67447916666666,310.0078125,237.34114583333334,313.3411458333333,235.0078125C316.6744791666667,232.67447916666666,320.3411458333333,231.34114583333334,324.5078125,229.84114583333334C328.6744791666667,228.34114583333334,333.3411458333333,226.67447916666666,338.6744791666667,224.5078125C344.0078125,222.34114583333334,350.0078125,219.67447916666666,354.8411458333333,217.67447916666666C359.6744791666667,215.67447916666666,363.3411458333333,214.34114583333334,366.6744791666667,211.34114583333334C370.0078125,208.34114583333334,373.0078125,203.67447916666666,369.8411458333333,201.34114583333334C366.6744791666667,199.0078125,357.3411458333333,199.0078125,341.5078125,199.0078125C325.6744791666667,199.0078125,303.3411458333333,199.0078125,280.5078125,201.17447916666666C257.6744791666667,203.34114583333334,234.34114583333334,207.67447916666666,214.84114583333334,212.5078125C195.34114583333334,217.34114583333334,179.67447916666666,222.67447916666666,166.34114583333334,227.0078125C153.0078125,231.34114583333334,142.0078125,234.67447916666666,133.67447916666666,237.67447916666666C125.34114583333333,240.67447916666666,119.67447916666667,243.34114583333334,114.84114583333333,245.67447916666666C110.0078125,248.0078125,106.0078125,250.0078125,106.0078125,249.17447916666666C106.0078125,248.34114583333334,110.0078125,244.67447916666666,118.67447916666667,236.84114583333334C127.34114583333333,229.0078125,140.67447916666666,217.0078125,153.17447916666666,205.84114583333334C165.67447916666666,194.67447916666666,177.34114583333334,184.34114583333334,188.67447916666666,174.67447916666666C200.0078125,165.0078125,211.0078125,156.0078125,220.67447916666666,148.67447916666666C230.34114583333334,141.34114583333334,238.67447916666666,135.67447916666666,246.84114583333334,131.5078125C255.0078125,127.34114583333333,263.0078125,124.67447916666667,266.5078125,125.34114583333333C270.0078125,126.0078125,269.0078125,130.0078125,268.1744791666667,135.17447916666666C267.3411458333333,140.34114583333334,266.6744791666667,146.67447916666666,266.8411458333333,150.17447916666666C267.0078125,153.67447916666666,268.0078125,154.34114583333334,271.1744791666667,154.84114583333334C274.3411458333333,155.34114583333334,279.6744791666667,155.67447916666666,285.1744791666667,155.84114583333334C290.6744791666667,156.0078125,296.3411458333333,156.0078125,302.6744791666667,156.34114583333334C309.0078125,156.67447916666666,316.0078125,157.34114583333334,322.6744791666667,159.0078125C329.3411458333333,160.67447916666666,335.6744791666667,163.34114583333334,340.3411458333333,166.17447916666666C345.0078125,169.0078125,348.0078125,172.0078125,350.5078125,174.34114583333334C353.0078125,176.67447916666666,355.0078125,178.34114583333334,358.3411458333333,180.17447916666666C361.6744791666667,182.0078125,366.3411458333333,184.0078125,373.3411458333333,186.0078125C380.3411458333333,188.0078125,389.6744791666667,190.0078125,401.6744791666667,191.5078125C413.6744791666667,193.0078125,428.3411458333333,194.0078125,441.1744791666667,194.5078125C454.0078125,195.0078125,465.0078125,195.0078125,476.1744791666667,195.0078125C487.3411458333333,195.0078125,498.6744791666667,195.0078125,508.3411458333333,195.0078125C518.0078125,195.0078125,526.0078125,195.0078125,530.6744791666666,195.0078125C535.3411458333334,195.0078125,536.6744791666666,195.0078125,537.3411458333334,195.0078125L538.0078125,195.0078125'


      let d = ctx.toString()

      console.log(d)

      return (
        <path key={idx}
              stroke={'black'}
              fill={fill[idx]}
              fillOpacity={fillOpacity}
              d={d}/>
      )
    })

		return (


			<g>

        {path_lines}


			</g>
		)
	}

	render() {

		const { selected, interactiveCursorClass } = this.props
		const { onDragStart, onDrag, onDragComplete, onHover, onUnHover } = this.props

		return <GenericChartComponent isHover={this.isHover}
                                  svgDraw={this.renderSVG}
                                  canvasToDraw={getMouseCanvas}
                                  canvasDraw={this.drawOnCanvas}
                                  interactiveCursorClass={interactiveCursorClass}
                                  selected={selected}
                                  onDragStart={onDragStart}
                                  onDrag={onDrag}
                                  onDragComplete={onDragComplete}
                                  onHover={onHover}
                                  onUnHover={onUnHover}
                                  drawOn={["mousemove", "mouseleave", "pan", "drag"]} />
	}
}

function getLineCoordinates (start, endX, endY, text) {
  const end = [
    endX,
    endY
  ]
  return {
    start, end, text
  }
}

function helper (props, moreProps) {
  const {startXY, endXY} = props

  const {
    xScale,
    chartConfig: {yScale}
  } = moreProps
  if (isNotDefined(startXY) || isNotDefined(endXY)) {
    return []
  }
  const [x1, y1] = startXY
  const [x2, y2] = endXY

  const dx = x2 - x1
  const dy = y2 - y1

  if (dx !== 0 && dy !== 0) {
    // console.log("modLine ->", startXY, modLine, dx1, dy1)
    const halfY = getLineCoordinates(
      startXY,
      x2,
      y1 + dy / 2,
      '2/1'
    )
    const oneThirdY = getLineCoordinates(
      startXY,
      x2,
      y1 + dy / 3,
      '3/1'
    )
    const oneFourthY = getLineCoordinates(
      startXY,
      x2,
      y1 + dy / 4,
      '4/1'
    )
    const oneEighthY = getLineCoordinates(
      startXY,
      x2,
      y1 + dy / 8,
      '8/1'
    )
    const halfX = getLineCoordinates(
      startXY,
      x1 + dx / 2,
      y2,
      '1/2'
    )
    const oneThirdX = getLineCoordinates(
      startXY,
      x1 + dx / 3,
      y2,
      '1/3'
    )
    const oneFourthX = getLineCoordinates(
      startXY,
      x1 + dx / 4,
      y2,
      '1/4'
    )
    const oneEighthX = getLineCoordinates(
      startXY,
      x1 + dx / 8,
      y2,
      '1/8'
    )
    const lines = [
      oneEighthX,
      oneFourthX,
      oneThirdX,
      halfX,
      {start: startXY, end: endXY, text: '1/1'},
      halfY,
      oneThirdY,
      oneFourthY,
      oneEighthY
    ]
    const lineCoods = lines.map(line => {
      const {x1, y1, x2, y2} = generateLine({
        type: 'RAY',
        start: line.start,
        end: line.end,
        xScale,
        yScale
      })
      return {
        x1: xScale(x1),
        y1: yScale(y1),
        x2: xScale(x2),
        y2: yScale(y2),
        label: {
          x: xScale(line.end[0]),
          y: yScale(line.end[1]),
          text: line.text
        }
      }
    })
    return lineCoods
  }
  return []
}

GannFan.propTypes = {
  interactiveCursorClass: PropTypes.string,
  stroke: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  fill: PropTypes.arrayOf(PropTypes.string).isRequired,
  strokeOpacity: PropTypes.number.isRequired,
  fillOpacity: PropTypes.number.isRequired,

  fontFamily: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
  fontFill: PropTypes.string.isRequired,

  onDragStart: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDragComplete: PropTypes.func.isRequired,
  onHover: PropTypes.func,
  onUnHover: PropTypes.func,

  defaultClassName: PropTypes.string,

  tolerance: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired
}

GannFan.defaultProps = {
  onDragStart: noop,
  onDrag: noop,
  onDragComplete: noop,

  strokeWidth: 10,
  tolerance: 4,
  selected: false
}

export default GannFan
