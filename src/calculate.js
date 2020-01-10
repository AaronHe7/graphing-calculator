import { parseFunction } from './functionParsing.js';
import { view } from './rendering.js';
import { roundValue } from './math.js';

function calculateRoot(f, guess) {
  let root = newtonsMethod(f, guess);
  let expr = parseFunction(f);
  if (Math.abs(expr.evaluate({x: root})) < Math.pow(10, -10)) {
    return root;
  } else {
    return null;
  }
}

// Calculate the intercections of two graphs, f and g, by calculating the root of f - g.
function calculateIntersection(f1, f2, guess, depth = 100) {
  let expr1 = parseFunction(f1);
  let expr2 = parseFunction(f2);

  if (depth == 0) {
    if (Math.abs(expr1.evaluate({x: guess}) - expr2.evaluate({x: guess})) < Math.pow(10, -10)) {
      return {x: guess, y: expr1.evaluate({x: guess})}
    } else {
      return null;
    }
  }

  let x = guess;
  let y1 = expr1.evaluate({x});
  let y2 = expr2.evaluate({x});
  let y = y1 - y2;
  let deltaX = Math.pow(10, -5);
  let deltaY = expr1.evaluate({x: x + deltaX}) - expr2.evaluate({x: x + deltaX}) - y;
  let derivative = deltaY/deltaX;
  let nextGuess = x - y/derivative;
  return calculateIntersection(f1, f2, nextGuess, depth - 1);
}

// Approximates the x-intercept of a function given a guess
function newtonsMethod(f, guess, depth = 100) {
  if (depth == 0) {
    return guess;
  }
  let expr = parseFunction(f);
  let x = guess;
  let y = expr.evaluate({x});
  let deltaX = Math.pow(10, -5);
  let deltaY = expr.evaluate({x: x + deltaX}) - y;
  let derivative = deltaY/deltaX;
  let nextGuess = x - y/derivative;
  return newtonsMethod(f, nextGuess, depth - 1);
}

function renderCalculateTab() {
  let selects = document.querySelectorAll('.function-list');
  let enteredFunction = false;
  for (let i = 0; i < selects.length; i++) {
    let selectElement = selects[i];
    selectElement.innerHTML = '';
    for (let key in view.functions) {
      enteredFunction = true;
      let optionElement = document.createElement('option');
      let expression = view.functions[key].expression;
      optionElement.value = expression;
      optionElement.textContent = expression;
      selectElement.appendChild(optionElement);
    }
  }
  if (!enteredFunction) {
    document.querySelector('.calculate-tab .warning').textContent = 'Please enter a function in the "Functions" tab.';
  }
  else {
    document.querySelector('.calculate-tab .warning').textContent = '';
  }
}

function addCalculateTabListeners() {
  // Calculate root button
  document.querySelector('.roots > button').addEventListener('click', function() {
    let outputDiv = document.querySelector('.roots > .root-output');
    let guess = parseFloat(document.querySelector('.roots > input[name="guess"]').value);
    let expression = document.querySelector('.roots > select[name="expression"]').value;
    let root = calculateRoot(expression, guess);
    if (root != null) {
      outputDiv.textContent = `Root: (${roundValue(root, 6)}, 0)`;
    } else {
      outputDiv.textContent = 'Root not found';
    }
  });

  document.querySelector('.intersections > button').addEventListener('click', function() {
    let outputDiv = document.querySelector('.intersections > .intersection-output');
    let guess = parseFloat(document.querySelector('.intersections > input[name="guess"]').value);
    let expression1 = document.querySelector('.intersections > select[name="expression1"]').value;
    let expression2 = document.querySelector('.intersections > select[name="expression2"]').value;
    let intersection = calculateIntersection(expression1, expression2, guess);

    if (intersection != null) {
      outputDiv.textContent = `Intersection: (${roundValue(intersection.x, 6)}, ${roundValue(intersection.y, 6)})`;
    } else {
      outputDiv.textContent = 'Intersection not found or graphs are equivalent';
    }
  });
}

export {addCalculateTabListeners, renderCalculateTab}
