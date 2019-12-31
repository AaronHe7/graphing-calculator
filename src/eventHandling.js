import {canvas, ctx, draw, view, render, toPixelCoord} from './rendering.js'

let isDragging = false;
let numOfFunctions = 0;
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

function addFunction() {
  numOfFunctions++;
  let functionName = 'y' + numOfFunctions;
  let functionTemplate = document.getElementById('function-template').cloneNode(true);

  let input = functionTemplate.querySelector('input');
  let select = functionTemplate.querySelector('select');
  let colors = [];

  // Creates an array of the possible colors
  for (let i = 0, options = select.children; i < options.length; i++) {
    colors.push(options[i].value);
  }
  // Make sure the function starts with a different color
  let functionColor = colors[(numOfFunctions - 1) % colors.length];

  functionTemplate.removeAttribute('id')
  functionTemplate.classList.add(functionName);
  // Add attributes
  input.name = functionName;
  input.placeholder = functionName;
  select.name = functionName;
  select.value = functionColor;
  // Insert the function before the button
  document.querySelector('.function-tab').insertBefore(functionTemplate, document.querySelector('button'));
  // Whenever the input is updated, update the graph
  let event1 = input.addEventListener('input', graphFunctions);
  let event2 = select.addEventListener('change', graphFunctions);
  let event3 = functionTemplate.querySelector('.delete').addEventListener('click', function() {
    functionTemplate.removeEventListener('input', event1);
    functionTemplate.removeEventListener('change', event2);
    functionTemplate.removeEventListener('click', event3);
    functionTemplate.innerHTML = '';
    graphFunctions();
  });
}

addFunction();

// Retrieve all inputs from the DOM, and add it to the view variable
function graphFunctions() {
  for (let i = 1; i <= numOfFunctions; i++) {
    let functionName = 'y' + i;
    let functionInput = document.querySelector(`.function-tab input[name="${functionName}"]`);
    if (functionInput) {
      let functionObject = view.functions[functionName] = {};
      functionObject.expression = functionInput.value;
      functionObject.color = document.querySelector(`.function-tab select[name="${functionName}"]`).value;
    } else {
      delete view.functions[functionName];
    }
  }
  render();
}

function eventHandling() {
  canvas.addEventListener('mousedown', function(e) {
    draggedPoint = mousePos(e);
    isDragging = true;
    let currentPos = mousePos(e);
    render();
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

  // "Add Function" button
  document.querySelector('.function-tab > button[class="add-function"]').addEventListener('click', function() {
    addFunction();
  });
}

export { eventHandling }