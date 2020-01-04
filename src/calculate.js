import {parseFunction} from './functionParsing.js';
function calculateRoot(f, xMin, xMax) {
  let expr = parseFunction(f);
  let precision = 1000;
  let guesses = [];
  let previousX;
  let previousY;
  for (let i = 0; i <= precision; i++) {
    let x = xMin + i * (xMax - xMin)/precision;
    let y = expr.evaluate({x});

    previousX = x;
    previousY = y
  }
}

// Approximates the x-intercept of a function given a guess
function newtonsMethod(f, guess, depth = 20) {
  if (depth == 0) {
    return guess;
  }
  let expr = parseFunction(f);
  let x = guess;
  let y = expr.evaluate({x});
  let deltaX = Math.pow(10, -4);
  let deltaY = expr.evaluate({x: x + deltaX}) - y;
  let derivative = deltaY/deltaX;
  let nextGuess = x - y/derivative;
  return newtonsMethod(f, nextGuess, depth - 1);
}
export {calculateRoot}
