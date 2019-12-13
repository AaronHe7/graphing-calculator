import { Draw } from './drawing.js';

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// Increase canvas resolution
canvas.scale = 2;
canvas.style.width = canvas.width + 'px';
canvas.style.height = canvas.height + 'px';
canvas.width *= canvas.scale;
canvas.height *= canvas.scale;

let draw = new Draw(canvas);
let window = {
  xScale: 4,
  yScale: 4,
  xMin: -22,
  xMax: 22,
  yMin: -22,
  yMax: 22
}

function toPixelCoord(x, y) {
  let pixelX = (x - window.xMin)/(window.xMax - window.xMin) * canvas.width;
  let pixelY = (window.yMax - y)/(window.yMax - window.yMin) * canvas.width;
  return {x: pixelX, y: pixelY};
}

// Round scale to one or two significant digits
function roundScale(scale) {
  if (scale >= 1 && scale <= 9) {
    return parseFloat((scale).toPrecision(1));
  } else {
    return parseFloat((scale).toPrecision(2));
  }
}

// Find scale with about 5 tick marks on x and y axis
function findAutoScale() {
}

// Draws axes and grid ticks
function drawAxes() {
  ctx.lineWidth = 1.5 * canvas.scale;
  // y axis
  draw.line(0, toPixelCoord(0, 0).y, canvas.width, toPixelCoord(0, 0).y);
  // x axis
  draw.line(toPixelCoord(0, 0).x, 0, toPixelCoord(0, 0).x, canvas.height);

  // ticks on x axis
  ctx.textBaseline = 'middle';
  // ex: min: -2, max: 3, signifies 2 ticks right of x axis, and 3 ticks left
  let xTickRange = {
    min: Math.ceil(window.xMin/window.xScale),
    max: Math.floor(window.xMax/window.xScale)
  }

  for (let i = xTickRange.min; i <= xTickRange.max; i++) {
    ctx.textAlign = 'center';

    if (i == 0) continue;
    let xDisplayValue = parseFloat((i * window.xScale).toPrecision(4));
    let xDraw = toPixelCoord(i * window.xScale, 0).x
    let yDraw = toPixelCoord(0, 0).y;
    // grid lines
    draw.line(xDraw, 0, xDraw, canvas.height, 'lightgray');
    // ticks and labels
    draw.line(xDraw, yDraw + 5 * canvas.scale, xDraw, yDraw - 5 * canvas.scale);
    draw.text(xDisplayValue, xDraw, yDraw + 15 * canvas.scale);
  }

  // ticks on y axis
  // ex: min: -2, max: 3, signifies 2 ticks above y axis, and 3 ticks below
  let yTickRange = {
    min: Math.ceil(window.yMin/window.yScale),
    max: Math.floor(window.yMax/window.yScale)
  }

  for (let i = yTickRange.min; i <= yTickRange.max; i++) {
    if (i == 0) continue;
    ctx.textAlign = 'end';

    let yDisplayValue = parseFloat((i * window.xScale).toPrecision(4));
    let xDraw = toPixelCoord(0, 0).x
    let yDraw = toPixelCoord(0, i * window.yScale).y;
    // grid lines
    draw.line(0, yDraw, canvas.width, yDraw, 'lightgray');
    // ticks and labels
    draw.line(xDraw - 5 * canvas.scale, yDraw, xDraw + 5 * canvas.scale, yDraw);
    draw.text(yDisplayValue, xDraw - 10 * canvas.scale, yDraw);
  }
}


function render() {
  drawAxes();
}

export {render}
