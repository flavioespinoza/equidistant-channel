export { default as Annotate } from './Annotate'
export { default as LabelAnnotation } from './LabelAnnotation'
export { default as SvgPathAnnotation } from './SvgPathAnnotation'
export { default as Label } from './Label'

let scale = 0.35
const halfWidth = 20 * scale
const bottomWidth = 6 * scale
const height = 40 * scale

export function buyPath ({x, y}) {
  return `M${x} ${y} `
    + `L${x + halfWidth} ${y + halfWidth} `
    + `L${x + bottomWidth} ${y + halfWidth} `
    + `L${x + bottomWidth} ${y + height} `
    + `L${x - bottomWidth} ${y + height} `
    + `L${x - bottomWidth} ${y + halfWidth} `
    + `L${x - halfWidth} ${y + halfWidth} `
    + 'Z'
}

export function sellPath ({x, y}) {
  return `M${x} ${y} `
    + `L${x + halfWidth} ${y - halfWidth} `
    + `L${x + bottomWidth} ${y - halfWidth} `
    + `L${x + bottomWidth} ${y - height} `
    + `L${x - bottomWidth} ${y - height} `
    + `L${x - bottomWidth} ${y - halfWidth} `
    + `L${x - halfWidth} ${y - halfWidth} `
    + 'Z'
}
