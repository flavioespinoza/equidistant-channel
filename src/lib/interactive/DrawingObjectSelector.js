'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { isDefined, noop, mapObject, head } from '../utils'
import { getMorePropsForChart, getSelected } from './utils'

import GenericComponent, { getMouseCanvas } from '../GenericComponent'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from '../../actions/chartDataActions'


const log = require('ololog').configure({
  locate: false
})

class DrawingObjectSelector extends Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleDoubleClick = this.handleDoubleClick.bind(this)
    this.getInteraction = this.getInteraction.bind(this)
  }

  handleDoubleClick (moreProps, e) {


    e.preventDefault()
    const {onDoubleClick} = this.props
    const {enabled} = this.props
    if (!enabled) return

    const interactives = this.getInteraction(moreProps)
    const selected = getSelected(interactives)

    if (selected.length > 0) {
      const item = head(selected)
      const morePropsForChart = getMorePropsForChart(
        moreProps, item.chartId
      )
      onDoubleClick(item, morePropsForChart)
    }
  }

  handleClick (moreProps, e) {

    // console.log('Drawing Object Selector: ', e.target)

    e.preventDefault()


    const {onSelect} = this.props
    const {enabled} = this.props

    if (!enabled) return

    const interactives = this.getInteraction(moreProps)

    onSelect(interactives, moreProps)


  }

  getInteraction (moreProps) {
    const {getInteractiveNodes, drawingObjectMap} = this.props
    const interactiveNodes = getInteractiveNodes()

    // console.log('interactiveNodes', interactiveNodes)

    const interactives = mapObject(interactiveNodes, each => {
      const key = drawingObjectMap[each.type]

      let valueArray
      if (isDefined(key)) {
        if (each) {
          if (each.node) {
            if (each.node.props) {
              valueArray = each.node.props[key]
            }
          } else {
            valueArray = undefined
          }
        }
      }

      const valuePresent = isDefined(valueArray)
        && Array.isArray(valueArray)
        && valueArray.length > 0
      if (valuePresent) {
        // console.log('Value present for ', each.type, each.chartId)
        const morePropsForChart = getMorePropsForChart(
          moreProps, each.chartId
        )

        const objects = each.node.getSelectionState(morePropsForChart)

        return {
          type: each.type,
          chartId: each.chartId,
          objects
        }
      }

      return {
        type: each.type,
        chartId: each.chartId,
        objects: []
      }
    })

    // console.log('interactives', interactives)

    return interactives
  }

  render () {
    return (
      <GenericComponent
        svgDraw={noop}
        canvasToDraw={getMouseCanvas}
        canvasDraw={noop}

        onMouseDown={this.handleClick}
        onDoubleClick={this.handleDoubleClick}

        drawOn={['mousemove', 'pan', 'drag']}
      />
    )
  }
}

DrawingObjectSelector.propTypes = {
  getInteractiveNodes: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  drawingObjectMap: PropTypes.object.isRequired,
  enabled: PropTypes.bool.isRequired
}

DrawingObjectSelector.defaultProps = {
  enabled: true,
  onDoubleClick: noop
}

function mapStateToProps (state) {
  return {
    openOrders: state.chartData.openOrders,
    textList_1: state.chartData.textList_1,
    orderHistory: state.chartData.orderHistory,
    orderHistoryList_1: state.chartData.orderHistoryList_1,
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
)(DrawingObjectSelector)