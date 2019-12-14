import {canvas, ctx, draw, view, render, toPixelCoord} from './rendering.js'

let isDragging = false;
let draggedPoint;

function mousePos(e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
}

// px to units
function toUnitCoord(x, y) {
  let graphWidth = view.xMax - view.xMin;
  let graphHeight = view.yMax - view.yMin;
  return {
    x: view.yMin + (x/(canvas.trueWidth)) * graphWidth,
    y: view.yMax - (y/(canvas.trueHeight)) * graphHeight
  };
}

function eventHandling() {
  canvas.addEventListener('mousedown', function(e) {
    draggedPoint = mousePos(e);
    isDragging = true;
  });
  document.addEventListener('mouseup', function() {
    isDragging = false;
  });
  // Handles dragging; moves window opposite of dragged direction
  canvas.addEventListener('mousemove', function(e) {
    if (isDragging) {

      let currentPos = mousePos(e);
      let xDiff = toUnitCoord(currentPos.x, 0).x - toUnitCoord(draggedPoint.x, 0).x;
      let yDiff = toUnitCoord(0, currentPos.y).y - toUnitCoord(0, draggedPoint.y).y;

      view.xMin -= xDiff;
      view.xMax -= xDiff;
      view.yMin -= yDiff;
      view.yMax -= yDiff;

      draggedPoint = currentPos;
      render();
    }
  });
}

export { eventHandling }
