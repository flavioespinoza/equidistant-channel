import _ from 'lodash'
const log = require('ololog').configure({
  locate: false
})

export function toggleOverlay1 (__bool) {
  // log.blue('TOGGLE_OVERLAY_1: ', __bool)
  return {
    type: 'TOGGLE_OVERLAY_1',
    payload: __bool,
  }
}
export function xScaleFactor (__x_scale_factor) {
  // log.blue('X_SCALE_FACTOR: ', __x_scale_factor)
  return {
    type: 'X_SCALE_FACTOR',
    payload: __x_scale_factor,
  }
}

export function rectVerticalWidth (__rect_vertical_width) {
  // log.yellow('RECT_VERTICAL_WIDTH', __rect_vertical_width)
  return {
    type: 'RECT_VERTICAL_WIDTH',
    payload: __rect_vertical_width,
  }
}

export function rectOpacity (__rect_opacity) {
  // log.cyan('RECT_OPACITY', __rect_opacity)
  return {
    type: 'RECT_OPACITY',
    payload: __rect_opacity,
  }
}

