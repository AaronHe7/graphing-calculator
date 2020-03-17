import {canvas, ctx, draw, view, render, toPixelCoord} from './rendering.js'
import { parseFunction } from './functionParsing.js';
import {renderCalculateTab, addCalculateTabListeners} from './calculate.js';

let isDragging = false;
let numOfFunctions = 0;
let draggedPoint;

function mousePos(e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * canvas.width/(rect.right - rect.left),
    y: (e.clientY - rect.top) * canvas.height/(rect.bottom - rect.top)
  };
}

// px to units
function toUnitCoord(x, y) {
  let graphWidth = view.xMax - view.xMin;
  let graphHeight = view.yMax - view.yMin;
  return {
    x: view.xMin + (x/(canvas.width)) * graphWidth,
    y: view.yMax - (y/(canvas.height)) * graphHeight
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
  // document.querySelector('.functions').insertBefore(functionTemplate, document.querySelector('button'));
  document.querySelector('.functions').appendChild(functionTemplate);
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
    let functionInput = document.querySelector(`.functions input[name="${functionName}"]`);
    if (functionInput) {
      let functionObject = view.functions[functionName] = {};
      functionObject.expression = functionInput.value;
      functionObject.color = document.querySelector(`.functions select[name="${functionName}"]`).value;
    } else {
      delete view.functions[functionName];
    }
  }
  render();
}

// Render calculator options tab (graph, table, calculate)
function renderTab(tabName) {
  let tabList = ['function', 'table', 'calculate'];
  for (let i = 0; i < tabList.length; i++) {
    try {
      document.querySelector(`.${tabList[i]}-nav`).style.backgroundColor = 'whitesmoke';
      document.querySelector(`.${tabList[i]}-tab`).style.display = 'none';
    } catch(e) {
      console.log(`Tab not found: ${tabList[i]}.`);
    }
  }
  if (tabName == 'calculate') {
    renderCalculateTab();
  }
  document.querySelector(`.${tabName}-nav`).style.backgroundColor = 'lightgray';
  document.querySelector(`.${tabName}-tab`).style.display = '';
}

// Render tabs in the navbar
function renderNavBarTab(tabName) {
  let tabList = ['home', 'about'];
  for (let i = 0; i < tabList.length; i++) {
    let tab = tabList[i];
    let tabDiv = document.querySelector('.' + tab + '-page');
    let tabLinkDiv = document.getElementById(tab)
    if (tab == tabName) {
      tabDiv.style.display = '';
      tabLinkDiv.style.fontWeight = 'bold';
    } else {
      tabDiv.style.display = 'none';
      tabLinkDiv.style.fontWeight = 'normal';
    }
  }
}

renderNavBarTab('home');

function addCanvasListeners() {
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
    e.preventDefault();
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
  });

  // Trace functionality; show the point on a graph closest to the cursor
  canvas.addEventListener('mousemove', function(e) {
    let mousePosX = toUnitCoord(mousePos(e).x, 0).x;
    let mousePosY = toUnitCoord(0, mousePos(e).y).y;
    let pointY;
    let pointColor;
    for (let key in view.functions) {
      let expr = parseFunction(view.functions[key].expression);
      let y = expr.evaluate({x: mousePosX});
      if (y > view.yMin && y < view.yMax && Math.abs(mousePos(e).y - toPixelCoord(0, y).y) < 50) {
        if (!pointY || Math.abs(y - mousePosY) < Math.abs(pointY - mousePosY)) {
          pointY = y
          pointColor = view.functions[key].color;
        }
      }
    }
    // Draw point
    if (pointY && pointColor) {
      view.point.x = mousePosX;
      view.point.y = pointY;
      view.point.color = pointColor;
    } else {
      view.point = {};
    }
    render();
  });

  canvas.onmouseout = function() {
    view.point = {};
    render();
  }
}

function eventHandling() {
  addCanvasListeners()

  // "Add Function" button
  document.querySelector('button[class="add-function"]').addEventListener('click', function() {
    addFunction();
  });

  // event listeners for the window
  let windowElements = ['x-min', 'x-max', 'y-min', 'y-max', 'x-scale', 'y-scale'];
  for (let i = 0; i < windowElements.length; i++) {
    document.querySelector(`input[name="${windowElements[i]}"]`).addEventListener('input', function() {
      let xMin = document.querySelector('input[name="x-min"]').value;
      let xMax = document.querySelector('input[name="x-max"]').value;
      let xScale = parseFloat(document.querySelector('input[name="x-scale"]').value);
      let yMin = document.querySelector('input[name="y-min"]').value;
      let yMax = document.querySelector('input[name="y-max"]').value;
      let yScale = parseFloat(document.querySelector('input[name="y-scale"]').value);

      if (xMin && xMax && parseFloat(xMin) < parseFloat(xMax)) {
        view.xMax = parseFloat(xMax);
        view.xMin = parseFloat(xMin);
      }

      if (yMin && yMax && parseFloat(yMin) < parseFloat(yMax)) {
        view.yMax = parseFloat(yMax);
        view.yMin = parseFloat(yMin);
      }

      if (xScale && xScale > 0) {
        view.xScale = xScale;
      } else {
        view.xScale = 4;
      }
      if (yScale && yScale > 0) {
        view.yScale = yScale;
      } else {
        view.yScale = 4;
      }
      render();
    });
  }

  document.querySelector('button[class="clear-window"]').addEventListener('click', function() {
    for (let i = 0; i < windowElements.length; i++) {
      document.querySelector(`input[name="${windowElements[i]}"]`).value = '';
    }
  });

  document.querySelector('button[class="reset-window"]').addEventListener('click', function() {
    view.xMin = -22.5;
    view.xMax = 22.5;
    view.yMin = -22.5;
    view.yMax = 22.5;
    view.xScale = 4;
    view.yScale = 4;
    render();
  });

  // render tabs
  let tabList = ['function', 'table', 'calculate'];
  for (let i = 0; i < tabList.length; i++) {
    document.querySelector(`.${tabList[i]}-nav`).addEventListener('click', function() {
      renderTab(tabList[i]);
    });
  }
  addCalculateTabListeners();

  let tabListNav = ['home', 'about'];
  for (let i = 0; i < tabListNav.length; i++) {
    document.querySelector(`#${tabListNav[i]}`).addEventListener('click', function() {
      renderNavBarTab(tabListNav[i]);
    });
  }
}

export { eventHandling, renderTab };
