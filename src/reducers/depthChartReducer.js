const log = require('ololog').configure({
  locate: false
})

export default function reducer(state={
  toggle_overlay_1: true,
  x_scale_factor: 0.05,
  rect_vertical_width: 3,
  rect_opacity: 0.25,
}, action) {

  switch (action.type) {

    case 'TOGGLE_OVERLAY_1': {
      // log.red('TOGGLE_OVERLAY_1', action.payload)
      return {
        ...state,
        toggle_overlay_1: action.payload
      }
    }
    case 'X_SCALE_FACTOR': {
      // log.blue('X_SCALE_FACTOR', action.payload)
      return {
        ...state,
        x_scale_factor: action.payload
      }
    }
    case 'RECT_VERTICAL_WIDTH': {
      // log.yellow('RECT_VERTICAL_WIDTH', action.payload)
      return {
        ...state,
        rect_vertical_width: action.payload
      }
    }
    case 'RECT_OPACITY': {
      // log.cyan('RECT_OPACITY', action.payload)
      return {
        ...state,
        rect_opacity: action.payload
      }
    }

  }

  return state

}