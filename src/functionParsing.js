// https://github.com/silentmatt/expr-eval/tree/master
let Parser = require('expr-eval').Parser;

var parser = new Parser();

String.prototype.add = function(index, string) {
  return this.slice(0, index) + string + this.slice(index);
}

function parseFunction(expression) {
  expression = expression.split(' ').join('');
  expression = logify(expression);
  expression = addMultiplySymbols(expression);
  return parser.parse(expression);
}

// Add a multiplication symbol if it is ommited
// e.g: '3x' -> '3*x', '(x+1)(x+2)' -> '(x+1)*(x+2)'
function addMultiplySymbols(expression) {
  for (let i = 0; i < expression.length; i++) {
    /* A multiplication symbol is added if a:
    - number comes before a variable or opening bracket
    - closing bracket or number comes before an opening bracket
    */
    if ((!isNaN(expression[i]) || [')', 'x'].includes(expression[i]))  && (expression[i + 1] == '(' || expression[i + 1] && /[a-z]/.test(expression[i + 1]))) {
      expression = expression.add(i + 1, '*');
    }
  }
  return expression;
}

// Allow logs with any base
// e.g 'log3(x)' -> 'ln(x)/ln(3)'
function logify(expression) {
  // let log(x) be equivalent to log10(x)
  expression = expression.replace(/log\(/g, 'log10(')

  let logRegex = /log\d+\([^)]+\)/;
  let logExpressions = expression.match(logRegex);
  while (logExpressions) {
    for (let i = 0; i < logExpressions.length; i++) {
      logExpressions[i] = fixBrackets(logExpressions[i]);
      let logBase = /log(\d+)\([^)]+\)/.exec(logExpressions[i])[1];
      let logArg = fixBrackets(/log\d+\(([^)]+)\)/.exec(logExpressions[i])[1]);
      let oldExpression = expression;
      expression = expression.replace(logExpressions[i], `(ln(${logArg})/ln(${logBase}))`);
      if (oldExpression == expression) {
        return expression;
      }
    }
    logExpressions = expression.match(logRegex);
  }
  return expression;
}

// Fixes inequality between opening and closing brackets
// e.g 'sin(x))' -> '(sin(x))', 'sin(x' -> 'sin(x)'
function fixBrackets(expression) {
  let openingBrackets = 0;
  let closingBrackets = 0;
  for (let i = 0; i < expression.length; i++) {
    if (expression[i] == '(') {
      openingBrackets++;
    } else if (expression[i] == ')') {
      closingBrackets++;
    }
  }
  while (openingBrackets > closingBrackets) {
    expression += ')'
    closingBrackets++;
  }
  while (closingBrackets > openingBrackets) {
    expression = '(' + expression;
    openingBrackets++;
  }
  return expression;
}

export { parseFunction }
