import {canvas, ctx, draw, view, render, toPixelCoord} from './rendering.js'

let isDragging = false;
let draggedPoint;

function mousePos(e) {
  let rect = canvas.getBoundingClientRect();
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
    x: view.xMin + (x/(canvas.trueWidth)) * graphWidth,
    y: view.yMax - (y/(canvas.trueHeight)) * graphHeight
  };
}

function eventHandling() {
  canvas.addEventListener('mousedown', function(e) {
    draggedPoint = mousePos(e);
    isDragging = true;
    let currentPos = mousePos(e);
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

  // Zooming in and out
  canvas.addEventListener('wheel', function(e) {
    let currentPos = mousePos(e);
    let gridPos = toUnitCoord(currentPos.x, currentPos.y);

    let distFromLeft = gridPos.x - view.xMin;
    let distFromRight = view.xMax - gridPos.x;
    let distFromTop = view.yMax - gridPos.y;
    let distFromBottom = gridPos.y - view.yMin;
    let factor = 0.05;
    // zoom out
    if (e.deltaY > 0) {
      view.xMin -= distFromLeft * factor;
      view.xMax += distFromRight * factor;
      view.yMin -= distFromBottom * factor;
      view.yMax += distFromTop * factor;
    }
    // zoom in
    else if (e.deltaY < 0) {
      view.xMin += distFromLeft * factor;
      view.xMax -= distFromRight * factor;
      view.yMin += distFromBottom * factor;
      view.yMax -= distFromTop * factor;
    }
    render();
    e.preventDefault();
  });

  document.querySelector('.functions > button').addEventListener('click', function() {
    view.functions.y1 = {}
    view.functions.y1.expression = document.querySelector('.functions input[name="y1"]').value;
    view.functions.y1.color = document.querySelector('.functions select[name="y1"]').value;
    // console.log(view.functions.y1)
    render();
  })
}

export { eventHandling }
