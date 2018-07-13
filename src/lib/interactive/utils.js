import {
  isNotDefined,
  isDefined,
  mapObject,
  find
} from '../utils'

export function getValueFromOverride (override, index, key, defaultValue) {
  if (isDefined(override) && override.index === index)
    return override[key]
  return defaultValue
}

export function terminate () {
  this.setState({
    current: null,
    override: null
  })
}

export function saveNodeType (type) {
  return node => {
    if (isNotDefined(node) && isDefined(this.nodes[type])) {
      delete this.nodes[type]
    } else {
      this.nodes[type] = node
    }
    // console.error(this.nodes)
  }
}

export function isHoverForInteractiveType (interactiveType) {
  return function (moreProps) { // this has to be function as it is bound to this
    const __self = this
    let selecedNodes
    let interactive
    if (isDefined(__self.nodes)) {

      selecedNodes = __self.nodes.map(function (node) {
        if (node.isHover) {
          node.isHover(moreProps)
        } else {
          node.isHover = function (moreProps) {

          }
        }

      })

      interactive = this.props[interactiveType].map((t, idx) => {
        return {
          ...t,
          selected: selecedNodes[idx]
        }
      })
      return interactive
    }
  }
}

export function isHover (moreProps) {
  const hovering = mapObject(this.nodes, node => node.isHover(moreProps))
    .reduce((a, b) => {
      return a || b
    })
  return hovering
}

function getMouseXY (moreProps, [ox, oy]) {
  if (Array.isArray(moreProps.mouseXY)) {
    const {mouseXY: [x, y]} = moreProps
    const mouseXY = [
      x - ox,
      y - oy
    ]
    return mouseXY
  }
  return moreProps.mouseXY
}

export function getMorePropsForChart (moreProps, chartId) {
  const {chartConfig: chartConfigList} = moreProps
  const chartConfig = find(chartConfigList, each => each.id === chartId)

  const {origin} = chartConfig
  const mouseXY = getMouseXY(moreProps, origin)
  return {
    ...moreProps,
    chartConfig,
    mouseXY
  }
}

export function getSelected (interactives) {
  const selected = interactives
    .map(each => {
      const objects = each.objects.filter(obj => {
        return obj.selected
      })
      return {
        ...each,
        objects
      }
    })
    .filter(each => each.objects.length > 0)
  return selected
}

export function DateDiff (date1, date2) {
  this.days = null
  this.hours = null
  this.minutes = null
  this.seconds = null
  this.date1 = date1
  this.date2 = date2

  this.init()
}

DateDiff.prototype.init = function () {
  let data = new DateMeasure(this.date1 - this.date2)
  this.days = data.days
  this.hours = data.hours
  this.minutes = data.minutes
  this.seconds = data.seconds
}

function DateMeasure (ms) {
  let d, h, m, s
  s = Math.floor(ms / 1000)
  m = Math.floor(s / 60)
  s = s % 60
  h = Math.floor(m / 60)
  m = m % 60
  d = Math.floor(h / 24)
  h = h % 24

  this.days = d
  this.hours = h
  this.minutes = m
  this.seconds = s
}

Date.diff = function (date1, date2) {
  return new DateDiff(date1, date2)
}

Date.prototype.diff = function (date2) {
  return new DateDiff(this, date2)
}


