"use strict";
import React from "react";
import PropTypes from "prop-types";

import { hexToRGBA, functor } from "../utils";

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from '../../actions/chartDataActions'

const log = require('ololog').configure({
  locate: false
})


import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as foo from '../actions/foo'

let name = ''

class OrderCircleMarker extends React.Component {

  componentWillMount() {

  }

  render() {

    const { className, stroke, strokeWidth, opacity, fill, point, r } = props;
    const radius = functor(r)(point.datum);

    return (
      <circle className={className}
              cx={point.x}
              cy={point.y}
              stroke={stroke}
              strokeWidth={strokeWidth}
              fillOpacity={opacity}
              fill={fill}
              r={radius}
      />
    )


  }
}


OrderCircleMarker.propTypes = {
  stroke: PropTypes.string,
  fill: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired,
  point: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    datum: PropTypes.object.isRequired,
  }).isRequired,
  className: PropTypes.string,
  strokeWidth: PropTypes.number,
  r: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func
  ]).isRequired
};

OrderCircleMarker.defaultProps = {
  stroke: "#4682B4",
  strokeWidth: 1,
  opacity: 0.5,
  fill: "#4682B4",
  className: "react-stockcharts-marker-circle",
};

OrderCircleMarker.drawOnCanvas = (props, point, ctx) => {

  const { stroke, fill, opacity, strokeWidth } = props;

  ctx.strokeStyle = stroke;
  ctx.lineWidth = strokeWidth;

  if (fill !== "none") {
    ctx.fillStyle = hexToRGBA(fill, opacity);
  }

  OrderCircleMarker.drawOnCanvasWithNoStateChange(props, point, ctx);

};


OrderCircleMarker.drawOnCanvasWithNoStateChange = (props, point, ctx) => {

  const { r } = props;
  const radius = functor(r)(point.datum);

  ctx.moveTo(point.x, point.y);
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.fill();
};

function mapStateToProps (state) {
  return {
    data: state.chartData.candleData,
    balances: state.chartData.balances,
    height: 1200,
    orders: state.chartData.openOrders,
    orderHistory: state.chartData.orderHistory,
    allOrders: state.chartData.allOrders,
    orderViewToggle: state.chartData.orderViewToggle,
    ordersCancelled: state.chartData.ordersCancelled,
    margins: {left: 12, right: 56, top: 0, bottom: 0},
    interval: state.chartData.interval,
    market: state.chartData.market,
    symbol: state.chartData.symbol,
    side: state.chartData.side,
    risk: state.chartData.risk,
    base: state.chartData.base,
    comp: state.chartData.comp,
    orderType: state.chartData.orderType,
    paradigm: state.chartData.paradigm,
    paradigmArray: state.chartData.paradigmArray,
    amountsArray: state.chartData.amountsArray,
    riskAmount: state.chartData.riskAmount,
    baseAmount: state.chartData.baseAmount,
    riskDivision: state.chartData.riskDivision,
    close: state.chartData.close,
    enableFib: state.chartData.enableFib,
    toggleFibOrder: state.chartData.toggleFibOrder,
    retracements_1: state.chartData.retracements_1,
    retracements_3: state.chartData.retracements_3,
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
)(OrderCircleMarker)