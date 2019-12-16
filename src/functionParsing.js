// https://github.com/silentmatt/expr-eval/tree/master
let Parser = require('expr-eval').Parser;

var parser = new Parser();

function parseFunction(f) {
  return parser.parse(f);
}

export { parseFunction }
