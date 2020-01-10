// Problem: computers with bigger monitors
import { Draw } from './drawing.js';
import { parseFunction } from './functionParsing.js';
import { renderTable } from './table.js';

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// Increase canvas resolution
canvas.scale = 2;
canvas.width *= canvas.scale;
canvas.height *= canvas.scale;

let draw = new Draw(canvas);
let view = {
  xScale: 4,
  yScale: 4,
  xMin: -22.5,
  xMax: 22.5,
  yMin: -22.5,
  yMax: 22.5,
  functions: {},
  point: {}
}
let expression = '';

// Units to px
function toPixelCoord(x, y) {
  let pixelX = (x - view.xMin)/(view.xMax - view.xMin) * canvas.width;
  let pixelY = (view.yMax - y)/(view.yMax - view.yMin) * canvas.width;
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

function roundTickMark(number) {
  if (number == 0) {
    return 0;
  }
  if (Math.abs(number) <= 0.0001) {
    return parseFloat((number).toPrecision(3)).toExponential().replace('e', '*10^');
  }
  if (Math.abs(number) < 100000) {
    return parseFloat((number).toPrecision(4));
  }
  if (Math.abs(number) >= 100000) {
    return number.toPrecision(2).replace('e+', '*10^');
  }
}


// Find a scale with about 10 tick marks on x and y axis
function findAutoScale() {
  let xScale = view.xScale;
  let yScale = view.yScale;

  if ((view.xMax <= view.xMin) || (view.yMax <= view.yMin) || (view.xScale <= 0) || (view.yScale <= 0)) {
    console.log('Error: invalid window settings');
    xScale = 4;
    yScale = 4;
  }
  if (Math.abs(view.xScale) == Infinity) {
    xScale = 4;
  } else if (Math.abs(view.yScale) == Infinity) {
    yScale = 4;
  }

  let windowLength = (view.xMax - view.xMin)/xScale;
  let windowHeight = (view.yMax - view.yMin)/yScale;

  while (windowLength > 12) {
    xScale *= 2;
    windowLength = (view.xMax - view.xMin)/xScale;
  }
  while (windowLength < 4) {
    xScale /= 2;
    windowLength = (view.xMax - view.xMin)/xScale;
  }
  while (windowHeight > 12) {
    yScale *= 2;
    windowHeight = (view.yMax - view.yMin)/yScale;
  }
  while (windowHeight < 4) {
    yScale /= 2;
    windowHeight = (view.yMax - view.yMin)/yScale;
  }
  return {xScale, yScale};
}

function drawGridLines() {
  ctx.lineWidth = canvas.scale;
  let xTickRange = {
    min: Math.ceil(view.xMin/view.xScale),
    max: Math.floor(view.xMax/view.xScale)
  }
  let yTickRange = {
    min: Math.ceil(view.yMin/view.yScale),
    max: Math.floor(view.yMax/view.yScale)
  }
  for (let i = xTickRange.min; i <= xTickRange.max; i++) {
    if (i == 0) continue;
    let xDraw = toPixelCoord(i * view.xScale, 0).x
    let yDraw = toPixelCoord(0, 0).y;
    draw.line(xDraw, 0, xDraw, canvas.height, 'lightgray');
  }
  for (let i = yTickRange.min; i <= yTickRange.max; i++) {
    if (i == 0) continue;
    let xDraw = toPixelCoord(0, 0).x
    let yDraw = toPixelCoord(0, i * view.yScale).y;
    draw.line(0, yDraw, canvas.width, yDraw, 'lightgray');
  }
}

// Draws axes
function drawAxes() {
  ctx.fillStyle = 'black';
  ctx.lineWidth = 1.5 * canvas.scale;
  // y axis
  draw.line(0, toPixelCoord(0, 0).y, canvas.width, toPixelCoord(0, 0).y);
  // x axis
  draw.line(toPixelCoord(0, 0).x, 0, toPixelCoord(0, 0).x, canvas.height);

  // ticks on x axis
  ctx.textBaseline = 'middle';
  // ex: min: -2, max: 3, signifies 2 ticks right of x axis, and 3 ticks left
  let xTickRange = {
    min: Math.ceil(view.xMin/view.xScale),
    max: Math.floor(view.xMax/view.xScale)
  }

  for (let i = xTickRange.min; i <= xTickRange.max; i++) {
    ctx.textAlign = 'center';

    if (i == 0) continue;
    let xDisplayValue = roundTickMark(i * view.xScale);
    let xDraw = toPixelCoord(i * view.xScale, 0).x
    let yDraw = toPixelCoord(0, 0).y;
    // ticks and labels
    draw.line(xDraw, yDraw + 5 * canvas.scale, xDraw, yDraw - 5 * canvas.scale);
    draw.text(xDisplayValue, xDraw, yDraw + 15 * canvas.scale);
  }

  // ticks on y axis
  // ex: min: -2, max: 3, signifies 2 ticks above y axis, and 3 ticks below
  let yTickRange = {
    min: Math.ceil(view.yMin/view.yScale),
    max: Math.floor(view.yMax/view.yScale)
  }

  for (let i = yTickRange.min; i <= yTickRange.max; i++) {
    if (i == 0) continue;
    ctx.textAlign = 'end';

    let yDisplayValue = roundTickMark(i * view.yScale);
    let xDraw = toPixelCoord(0, 0).x
    let yDraw = toPixelCoord(0, i * view.yScale).y;
    // ticks and labels
    draw.line(xDraw - 5 * canvas.scale, yDraw, xDraw + 5 * canvas.scale, yDraw);
    draw.text(yDisplayValue, xDraw - 10 * canvas.scale, yDraw);
  }
}


function drawGraph(expr, color = 'black') {
  let precision = 500;
  let previousDerivative = 0;
  let previousX = 0;
  for (let i = 0; i < precision; i++) {
    let currentX = view.xMin + i/precision * (view.xMax - view.xMin);
    let nextX = view.xMin + (i + 1) * (view.xMax - view.xMin)/precision;
    let currentY = expr.evaluate({ x: currentX });
    let nextY = expr.evaluate({ x: nextX });

    if (!currentY && !nextY) {
      continue;
    }

    // When the derivative of the graph changes from positive to negative, assume that it's trying to graph an asymptote
    let currentDerivative = (nextY - currentY)/(nextX - currentX);
    if (currentDerivative * previousDerivative >= 0) {
      draw.line(toPixelCoord(currentX, 0).x, toPixelCoord(0, currentY).y, toPixelCoord(nextX, 0).x, toPixelCoord(0, nextY).y, color);
    // Graphs more precisely around asymptotes. Fixes issue where lines that approach asymptotes suddenly cut off
    } else {
      // If curve approaches asymptote from left side
      if (Math.abs(previousDerivative) < Math.abs(currentDerivative) || !currentDerivative) {
        graphAroundAsymptote(expr, currentX, nextX, previousDerivative, 20, color);
      // If curve approaches asymptote from right side
      } else {
        graphAroundAsymptote(expr, nextX, previousX, currentDerivative, 20, color);
      }
      draw.line(toPixelCoord(currentX, 0).x, toPixelCoord(0, currentY).y, toPixelCoord(nextX, 0).x, toPixelCoord(0, currentY).y, color);
    }
    previousDerivative = currentDerivative;
    previousX = currentX;
  }
}

function drawPoint(x, y, color) {
  let pointX = toPixelCoord(x, 0).x;
  let pointY = toPixelCoord(0, y).y;
  draw.colorCircle(pointX, pointY, 5, color);
  ctx.textAlign = 'left';
  draw.text(`(${roundTickMark(x)}, ${roundTickMark(y)})`, pointX + 10, pointY + 15)
}

// graphAroundAsymptote recursively graphs more accurately around asymptotes. It fixes the issue where the curve that approaches asymptotes suddenly cut off
function graphAroundAsymptote(expr, aX1, aX2, previousDerivative, depth, color) {
  let precision = 2;
  for (let j = 0; j < precision; j++) {
    let currentX = aX1 + (aX2 - aX1) * j/precision;
    let nextX = aX1 + (aX2 - aX1) * (j + 1)/precision;
    let currentY = expr.evaluate({ x: currentX });
    let nextY = expr.evaluate({ x: nextX });
    let currentDerivative = (nextY - currentY)/(nextX - currentX);
    // Makes ure that when it is graphing around asymptotes, it doesn't accidently connect points through an asymptote
    if (currentDerivative * previousDerivative >= 0) {
      draw.line(toPixelCoord(currentX, 0).x, toPixelCoord(0, currentY).y, toPixelCoord(nextX, 0).x, toPixelCoord(0, nextY).y, color);
    } else {
      if (depth > 1) {
        graphAroundAsymptote(expr, currentX, nextX, previousDerivative, depth - 1, color);
      }
      return;
    }
    previousDerivative = currentDerivative;
  }
}

function render() {
  let autoScale = findAutoScale();
  view.xScale = autoScale.xScale;
  view.yScale = autoScale.yScale;
  draw.rect(0, 0, canvas.width, canvas.height);
  drawGridLines();
  drawAxes();
  for (let key in view.functions) {
    if (!view.functions[key].expression) {
      delete view.functions[key];
      continue;
    }
    try {
      drawGraph(parseFunction(view.functions[key].expression), view.functions[key].color);
    } catch(e) {
      console.log(view.functions[key].expression + ' is not a valid function.')
    }
  }
  // Draws point on graph closest to cursor
  drawPoint(view.point.x, view.point.y, view.point.color);
  renderTable();
}

export {canvas, ctx, draw, render, view, toPixelCoord, findAutoScale }
