// https://github.com/silentmatt/expr-eval/tree/master
let Parser = require('expr-eval').Parser;

var parser = new Parser();

String.prototype.add = function(index, string) {
  return this.slice(0, index) + string + this.slice(index);
}

function parseFunction(expression) {
  for (let i = 0; i < expression.length; i++) {
    // Add a multiplication symbol if it is ommited
    // e.g: '3x' -> '3*x'
    if ((!isNaN(expression[i]) || expression[i] == ')')  && expression[i + 1] && /[a-z]/.test(expression[i + 1])) {
      expression = expression.add(i + 1, '*')
    }
  }
  return parser.parse(expression);
}

export { parseFunction }
