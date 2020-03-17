/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/expr-eval/dist/index.mjs":
/*!***********************************************!*\
  !*** ./node_modules/expr-eval/dist/index.mjs ***!
  \***********************************************/
/*! exports provided: default, Expression, Parser */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Expression", function() { return Expression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Parser", function() { return Parser; });
var INUMBER = 'INUMBER';
var IOP1 = 'IOP1';
var IOP2 = 'IOP2';
var IOP3 = 'IOP3';
var IVAR = 'IVAR';
var IVARNAME = 'IVARNAME';
var IFUNCALL = 'IFUNCALL';
var IFUNDEF = 'IFUNDEF';
var IEXPR = 'IEXPR';
var IEXPREVAL = 'IEXPREVAL';
var IMEMBER = 'IMEMBER';
var IENDSTATEMENT = 'IENDSTATEMENT';
var IARRAY = 'IARRAY';

function Instruction(type, value) {
  this.type = type;
  this.value = (value !== undefined && value !== null) ? value : 0;
}

Instruction.prototype.toString = function () {
  switch (this.type) {
    case INUMBER:
    case IOP1:
    case IOP2:
    case IOP3:
    case IVAR:
    case IVARNAME:
    case IENDSTATEMENT:
      return this.value;
    case IFUNCALL:
      return 'CALL ' + this.value;
    case IFUNDEF:
      return 'DEF ' + this.value;
    case IARRAY:
      return 'ARRAY ' + this.value;
    case IMEMBER:
      return '.' + this.value;
    default:
      return 'Invalid Instruction';
  }
};

function unaryInstruction(value) {
  return new Instruction(IOP1, value);
}

function binaryInstruction(value) {
  return new Instruction(IOP2, value);
}

function ternaryInstruction(value) {
  return new Instruction(IOP3, value);
}

function simplify(tokens, unaryOps, binaryOps, ternaryOps, values) {
  var nstack = [];
  var newexpression = [];
  var n1, n2, n3;
  var f;
  for (var i = 0; i < tokens.length; i++) {
    var item = tokens[i];
    var type = item.type;
    if (type === INUMBER || type === IVARNAME) {
      if (Array.isArray(item.value)) {
        nstack.push.apply(nstack, simplify(item.value.map(function (x) {
          return new Instruction(INUMBER, x);
        }).concat(new Instruction(IARRAY, item.value.length)), unaryOps, binaryOps, ternaryOps, values));
      } else {
        nstack.push(item);
      }
    } else if (type === IVAR && values.hasOwnProperty(item.value)) {
      item = new Instruction(INUMBER, values[item.value]);
      nstack.push(item);
    } else if (type === IOP2 && nstack.length > 1) {
      n2 = nstack.pop();
      n1 = nstack.pop();
      f = binaryOps[item.value];
      item = new Instruction(INUMBER, f(n1.value, n2.value));
      nstack.push(item);
    } else if (type === IOP3 && nstack.length > 2) {
      n3 = nstack.pop();
      n2 = nstack.pop();
      n1 = nstack.pop();
      if (item.value === '?') {
        nstack.push(n1.value ? n2.value : n3.value);
      } else {
        f = ternaryOps[item.value];
        item = new Instruction(INUMBER, f(n1.value, n2.value, n3.value));
        nstack.push(item);
      }
    } else if (type === IOP1 && nstack.length > 0) {
      n1 = nstack.pop();
      f = unaryOps[item.value];
      item = new Instruction(INUMBER, f(n1.value));
      nstack.push(item);
    } else if (type === IEXPR) {
      while (nstack.length > 0) {
        newexpression.push(nstack.shift());
      }
      newexpression.push(new Instruction(IEXPR, simplify(item.value, unaryOps, binaryOps, ternaryOps, values)));
    } else if (type === IMEMBER && nstack.length > 0) {
      n1 = nstack.pop();
      nstack.push(new Instruction(INUMBER, n1.value[item.value]));
    } /* else if (type === IARRAY && nstack.length >= item.value) {
      var length = item.value;
      while (length-- > 0) {
        newexpression.push(nstack.pop());
      }
      newexpression.push(new Instruction(IARRAY, item.value));
    } */ else {
      while (nstack.length > 0) {
        newexpression.push(nstack.shift());
      }
      newexpression.push(item);
    }
  }
  while (nstack.length > 0) {
    newexpression.push(nstack.shift());
  }
  return newexpression;
}

function substitute(tokens, variable, expr) {
  var newexpression = [];
  for (var i = 0; i < tokens.length; i++) {
    var item = tokens[i];
    var type = item.type;
    if (type === IVAR && item.value === variable) {
      for (var j = 0; j < expr.tokens.length; j++) {
        var expritem = expr.tokens[j];
        var replitem;
        if (expritem.type === IOP1) {
          replitem = unaryInstruction(expritem.value);
        } else if (expritem.type === IOP2) {
          replitem = binaryInstruction(expritem.value);
        } else if (expritem.type === IOP3) {
          replitem = ternaryInstruction(expritem.value);
        } else {
          replitem = new Instruction(expritem.type, expritem.value);
        }
        newexpression.push(replitem);
      }
    } else if (type === IEXPR) {
      newexpression.push(new Instruction(IEXPR, substitute(item.value, variable, expr)));
    } else {
      newexpression.push(item);
    }
  }
  return newexpression;
}

function evaluate(tokens, expr, values) {
  var nstack = [];
  var n1, n2, n3;
  var f, args, argCount;

  if (isExpressionEvaluator(tokens)) {
    return resolveExpression(tokens, values);
  }

  var numTokens = tokens.length;

  for (var i = 0; i < numTokens; i++) {
    var item = tokens[i];
    var type = item.type;
    if (type === INUMBER || type === IVARNAME) {
      nstack.push(item.value);
    } else if (type === IOP2) {
      n2 = nstack.pop();
      n1 = nstack.pop();
      if (item.value === 'and') {
        nstack.push(n1 ? !!evaluate(n2, expr, values) : false);
      } else if (item.value === 'or') {
        nstack.push(n1 ? true : !!evaluate(n2, expr, values));
      } else if (item.value === '=') {
        f = expr.binaryOps[item.value];
        nstack.push(f(n1, evaluate(n2, expr, values), values));
      } else {
        f = expr.binaryOps[item.value];
        nstack.push(f(resolveExpression(n1, values), resolveExpression(n2, values)));
      }
    } else if (type === IOP3) {
      n3 = nstack.pop();
      n2 = nstack.pop();
      n1 = nstack.pop();
      if (item.value === '?') {
        nstack.push(evaluate(n1 ? n2 : n3, expr, values));
      } else {
        f = expr.ternaryOps[item.value];
        nstack.push(f(resolveExpression(n1, values), resolveExpression(n2, values), resolveExpression(n3, values)));
      }
    } else if (type === IVAR) {
      if (item.value in expr.functions) {
        nstack.push(expr.functions[item.value]);
      } else if (item.value in expr.unaryOps && expr.parser.isOperatorEnabled(item.value)) {
        nstack.push(expr.unaryOps[item.value]);
      } else {
        var v = values[item.value];
        if (v !== undefined) {
          nstack.push(v);
        } else {
          throw new Error('undefined variable: ' + item.value);
        }
      }
    } else if (type === IOP1) {
      n1 = nstack.pop();
      f = expr.unaryOps[item.value];
      nstack.push(f(resolveExpression(n1, values)));
    } else if (type === IFUNCALL) {
      argCount = item.value;
      args = [];
      while (argCount-- > 0) {
        args.unshift(resolveExpression(nstack.pop(), values));
      }
      f = nstack.pop();
      if (f.apply && f.call) {
        nstack.push(f.apply(undefined, args));
      } else {
        throw new Error(f + ' is not a function');
      }
    } else if (type === IFUNDEF) {
      // Create closure to keep references to arguments and expression
      nstack.push((function () {
        var n2 = nstack.pop();
        var args = [];
        var argCount = item.value;
        while (argCount-- > 0) {
          args.unshift(nstack.pop());
        }
        var n1 = nstack.pop();
        var f = function () {
          var scope = Object.assign({}, values);
          for (var i = 0, len = args.length; i < len; i++) {
            scope[args[i]] = arguments[i];
          }
          return evaluate(n2, expr, scope);
        };
        // f.name = n1
        Object.defineProperty(f, 'name', {
          value: n1,
          writable: false
        });
        values[n1] = f;
        return f;
      })());
    } else if (type === IEXPR) {
      nstack.push(createExpressionEvaluator(item, expr));
    } else if (type === IEXPREVAL) {
      nstack.push(item);
    } else if (type === IMEMBER) {
      n1 = nstack.pop();
      nstack.push(n1[item.value]);
    } else if (type === IENDSTATEMENT) {
      nstack.pop();
    } else if (type === IARRAY) {
      argCount = item.value;
      args = [];
      while (argCount-- > 0) {
        args.unshift(nstack.pop());
      }
      nstack.push(args);
    } else {
      throw new Error('invalid Expression');
    }
  }
  if (nstack.length > 1) {
    throw new Error('invalid Expression (parity)');
  }
  // Explicitly return zero to avoid test issues caused by -0
  return nstack[0] === 0 ? 0 : resolveExpression(nstack[0], values);
}

function createExpressionEvaluator(token, expr, values) {
  if (isExpressionEvaluator(token)) return token;
  return {
    type: IEXPREVAL,
    value: function (scope) {
      return evaluate(token.value, expr, scope);
    }
  };
}

function isExpressionEvaluator(n) {
  return n && n.type === IEXPREVAL;
}

function resolveExpression(n, values) {
  return isExpressionEvaluator(n) ? n.value(values) : n;
}

function expressionToString(tokens, toJS) {
  var nstack = [];
  var n1, n2, n3;
  var f, args, argCount;
  for (var i = 0; i < tokens.length; i++) {
    var item = tokens[i];
    var type = item.type;
    if (type === INUMBER) {
      if (typeof item.value === 'number' && item.value < 0) {
        nstack.push('(' + item.value + ')');
      } else if (Array.isArray(item.value)) {
        nstack.push('[' + item.value.map(escapeValue).join(', ') + ']');
      } else {
        nstack.push(escapeValue(item.value));
      }
    } else if (type === IOP2) {
      n2 = nstack.pop();
      n1 = nstack.pop();
      f = item.value;
      if (toJS) {
        if (f === '^') {
          nstack.push('Math.pow(' + n1 + ', ' + n2 + ')');
        } else if (f === 'and') {
          nstack.push('(!!' + n1 + ' && !!' + n2 + ')');
        } else if (f === 'or') {
          nstack.push('(!!' + n1 + ' || !!' + n2 + ')');
        } else if (f === '||') {
          nstack.push('(function(a,b){ return Array.isArray(a) && Array.isArray(b) ? a.concat(b) : String(a) + String(b); }((' + n1 + '),(' + n2 + ')))');
        } else if (f === '==') {
          nstack.push('(' + n1 + ' === ' + n2 + ')');
        } else if (f === '!=') {
          nstack.push('(' + n1 + ' !== ' + n2 + ')');
        } else if (f === '[') {
          nstack.push(n1 + '[(' + n2 + ') | 0]');
        } else {
          nstack.push('(' + n1 + ' ' + f + ' ' + n2 + ')');
        }
      } else {
        if (f === '[') {
          nstack.push(n1 + '[' + n2 + ']');
        } else {
          nstack.push('(' + n1 + ' ' + f + ' ' + n2 + ')');
        }
      }
    } else if (type === IOP3) {
      n3 = nstack.pop();
      n2 = nstack.pop();
      n1 = nstack.pop();
      f = item.value;
      if (f === '?') {
        nstack.push('(' + n1 + ' ? ' + n2 + ' : ' + n3 + ')');
      } else {
        throw new Error('invalid Expression');
      }
    } else if (type === IVAR || type === IVARNAME) {
      nstack.push(item.value);
    } else if (type === IOP1) {
      n1 = nstack.pop();
      f = item.value;
      if (f === '-' || f === '+') {
        nstack.push('(' + f + n1 + ')');
      } else if (toJS) {
        if (f === 'not') {
          nstack.push('(' + '!' + n1 + ')');
        } else if (f === '!') {
          nstack.push('fac(' + n1 + ')');
        } else {
          nstack.push(f + '(' + n1 + ')');
        }
      } else if (f === '!') {
        nstack.push('(' + n1 + '!)');
      } else {
        nstack.push('(' + f + ' ' + n1 + ')');
      }
    } else if (type === IFUNCALL) {
      argCount = item.value;
      args = [];
      while (argCount-- > 0) {
        args.unshift(nstack.pop());
      }
      f = nstack.pop();
      nstack.push(f + '(' + args.join(', ') + ')');
    } else if (type === IFUNDEF) {
      n2 = nstack.pop();
      argCount = item.value;
      args = [];
      while (argCount-- > 0) {
        args.unshift(nstack.pop());
      }
      n1 = nstack.pop();
      if (toJS) {
        nstack.push('(' + n1 + ' = function(' + args.join(', ') + ') { return ' + n2 + ' })');
      } else {
        nstack.push('(' + n1 + '(' + args.join(', ') + ') = ' + n2 + ')');
      }
    } else if (type === IMEMBER) {
      n1 = nstack.pop();
      nstack.push(n1 + '.' + item.value);
    } else if (type === IARRAY) {
      argCount = item.value;
      args = [];
      while (argCount-- > 0) {
        args.unshift(nstack.pop());
      }
      nstack.push('[' + args.join(', ') + ']');
    } else if (type === IEXPR) {
      nstack.push('(' + expressionToString(item.value, toJS) + ')');
    } else if (type === IENDSTATEMENT) ; else {
      throw new Error('invalid Expression');
    }
  }
  if (nstack.length > 1) {
    if (toJS) {
      nstack = [ nstack.join(',') ];
    } else {
      nstack = [ nstack.join(';') ];
    }
  }
  return String(nstack[0]);
}

function escapeValue(v) {
  if (typeof v === 'string') {
    return JSON.stringify(v).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  }
  return v;
}

function contains(array, obj) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === obj) {
      return true;
    }
  }
  return false;
}

function getSymbols(tokens, symbols, options) {
  options = options || {};
  var withMembers = !!options.withMembers;
  var prevVar = null;

  for (var i = 0; i < tokens.length; i++) {
    var item = tokens[i];
    if (item.type === IVAR || item.type === IVARNAME) {
      if (!withMembers && !contains(symbols, item.value)) {
        symbols.push(item.value);
      } else if (prevVar !== null) {
        if (!contains(symbols, prevVar)) {
          symbols.push(prevVar);
        }
        prevVar = item.value;
      } else {
        prevVar = item.value;
      }
    } else if (item.type === IMEMBER && withMembers && prevVar !== null) {
      prevVar += '.' + item.value;
    } else if (item.type === IEXPR) {
      getSymbols(item.value, symbols, options);
    } else if (prevVar !== null) {
      if (!contains(symbols, prevVar)) {
        symbols.push(prevVar);
      }
      prevVar = null;
    }
  }

  if (prevVar !== null && !contains(symbols, prevVar)) {
    symbols.push(prevVar);
  }
}

function Expression(tokens, parser) {
  this.tokens = tokens;
  this.parser = parser;
  this.unaryOps = parser.unaryOps;
  this.binaryOps = parser.binaryOps;
  this.ternaryOps = parser.ternaryOps;
  this.functions = parser.functions;
}

Expression.prototype.simplify = function (values) {
  values = values || {};
  return new Expression(simplify(this.tokens, this.unaryOps, this.binaryOps, this.ternaryOps, values), this.parser);
};

Expression.prototype.substitute = function (variable, expr) {
  if (!(expr instanceof Expression)) {
    expr = this.parser.parse(String(expr));
  }

  return new Expression(substitute(this.tokens, variable, expr), this.parser);
};

Expression.prototype.evaluate = function (values) {
  values = values || {};
  return evaluate(this.tokens, this, values);
};

Expression.prototype.toString = function () {
  return expressionToString(this.tokens, false);
};

Expression.prototype.symbols = function (options) {
  options = options || {};
  var vars = [];
  getSymbols(this.tokens, vars, options);
  return vars;
};

Expression.prototype.variables = function (options) {
  options = options || {};
  var vars = [];
  getSymbols(this.tokens, vars, options);
  var functions = this.functions;
  return vars.filter(function (name) {
    return !(name in functions);
  });
};

Expression.prototype.toJSFunction = function (param, variables) {
  var expr = this;
  var f = new Function(param, 'with(this.functions) with (this.ternaryOps) with (this.binaryOps) with (this.unaryOps) { return ' + expressionToString(this.simplify(variables).tokens, true) + '; }'); // eslint-disable-line no-new-func
  return function () {
    return f.apply(expr, arguments);
  };
};

var TEOF = 'TEOF';
var TOP = 'TOP';
var TNUMBER = 'TNUMBER';
var TSTRING = 'TSTRING';
var TPAREN = 'TPAREN';
var TBRACKET = 'TBRACKET';
var TCOMMA = 'TCOMMA';
var TNAME = 'TNAME';
var TSEMICOLON = 'TSEMICOLON';

function Token(type, value, index) {
  this.type = type;
  this.value = value;
  this.index = index;
}

Token.prototype.toString = function () {
  return this.type + ': ' + this.value;
};

function TokenStream(parser, expression) {
  this.pos = 0;
  this.current = null;
  this.unaryOps = parser.unaryOps;
  this.binaryOps = parser.binaryOps;
  this.ternaryOps = parser.ternaryOps;
  this.consts = parser.consts;
  this.expression = expression;
  this.savedPosition = 0;
  this.savedCurrent = null;
  this.options = parser.options;
  this.parser = parser;
}

TokenStream.prototype.newToken = function (type, value, pos) {
  return new Token(type, value, pos != null ? pos : this.pos);
};

TokenStream.prototype.save = function () {
  this.savedPosition = this.pos;
  this.savedCurrent = this.current;
};

TokenStream.prototype.restore = function () {
  this.pos = this.savedPosition;
  this.current = this.savedCurrent;
};

TokenStream.prototype.next = function () {
  if (this.pos >= this.expression.length) {
    return this.newToken(TEOF, 'EOF');
  }

  if (this.isWhitespace() || this.isComment()) {
    return this.next();
  } else if (this.isRadixInteger() ||
      this.isNumber() ||
      this.isOperator() ||
      this.isString() ||
      this.isParen() ||
      this.isBracket() ||
      this.isComma() ||
      this.isSemicolon() ||
      this.isNamedOp() ||
      this.isConst() ||
      this.isName()) {
    return this.current;
  } else {
    this.parseError('Unknown character "' + this.expression.charAt(this.pos) + '"');
  }
};

TokenStream.prototype.isString = function () {
  var r = false;
  var startPos = this.pos;
  var quote = this.expression.charAt(startPos);

  if (quote === '\'' || quote === '"') {
    var index = this.expression.indexOf(quote, startPos + 1);
    while (index >= 0 && this.pos < this.expression.length) {
      this.pos = index + 1;
      if (this.expression.charAt(index - 1) !== '\\') {
        var rawString = this.expression.substring(startPos + 1, index);
        this.current = this.newToken(TSTRING, this.unescape(rawString), startPos);
        r = true;
        break;
      }
      index = this.expression.indexOf(quote, index + 1);
    }
  }
  return r;
};

TokenStream.prototype.isParen = function () {
  var c = this.expression.charAt(this.pos);
  if (c === '(' || c === ')') {
    this.current = this.newToken(TPAREN, c);
    this.pos++;
    return true;
  }
  return false;
};

TokenStream.prototype.isBracket = function () {
  var c = this.expression.charAt(this.pos);
  if ((c === '[' || c === ']') && this.isOperatorEnabled('[')) {
    this.current = this.newToken(TBRACKET, c);
    this.pos++;
    return true;
  }
  return false;
};

TokenStream.prototype.isComma = function () {
  var c = this.expression.charAt(this.pos);
  if (c === ',') {
    this.current = this.newToken(TCOMMA, ',');
    this.pos++;
    return true;
  }
  return false;
};

TokenStream.prototype.isSemicolon = function () {
  var c = this.expression.charAt(this.pos);
  if (c === ';') {
    this.current = this.newToken(TSEMICOLON, ';');
    this.pos++;
    return true;
  }
  return false;
};

TokenStream.prototype.isConst = function () {
  var startPos = this.pos;
  var i = startPos;
  for (; i < this.expression.length; i++) {
    var c = this.expression.charAt(i);
    if (c.toUpperCase() === c.toLowerCase()) {
      if (i === this.pos || (c !== '_' && c !== '.' && (c < '0' || c > '9'))) {
        break;
      }
    }
  }
  if (i > startPos) {
    var str = this.expression.substring(startPos, i);
    if (str in this.consts) {
      this.current = this.newToken(TNUMBER, this.consts[str]);
      this.pos += str.length;
      return true;
    }
  }
  return false;
};

TokenStream.prototype.isNamedOp = function () {
  var startPos = this.pos;
  var i = startPos;
  for (; i < this.expression.length; i++) {
    var c = this.expression.charAt(i);
    if (c.toUpperCase() === c.toLowerCase()) {
      if (i === this.pos || (c !== '_' && (c < '0' || c > '9'))) {
        break;
      }
    }
  }
  if (i > startPos) {
    var str = this.expression.substring(startPos, i);
    if (this.isOperatorEnabled(str) && (str in this.binaryOps || str in this.unaryOps || str in this.ternaryOps)) {
      this.current = this.newToken(TOP, str);
      this.pos += str.length;
      return true;
    }
  }
  return false;
};

TokenStream.prototype.isName = function () {
  var startPos = this.pos;
  var i = startPos;
  var hasLetter = false;
  for (; i < this.expression.length; i++) {
    var c = this.expression.charAt(i);
    if (c.toUpperCase() === c.toLowerCase()) {
      if (i === this.pos && (c === '$' || c === '_')) {
        if (c === '_') {
          hasLetter = true;
        }
        continue;
      } else if (i === this.pos || !hasLetter || (c !== '_' && (c < '0' || c > '9'))) {
        break;
      }
    } else {
      hasLetter = true;
    }
  }
  if (hasLetter) {
    var str = this.expression.substring(startPos, i);
    this.current = this.newToken(TNAME, str);
    this.pos += str.length;
    return true;
  }
  return false;
};

TokenStream.prototype.isWhitespace = function () {
  var r = false;
  var c = this.expression.charAt(this.pos);
  while (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
    r = true;
    this.pos++;
    if (this.pos >= this.expression.length) {
      break;
    }
    c = this.expression.charAt(this.pos);
  }
  return r;
};

var codePointPattern = /^[0-9a-f]{4}$/i;

TokenStream.prototype.unescape = function (v) {
  var index = v.indexOf('\\');
  if (index < 0) {
    return v;
  }

  var buffer = v.substring(0, index);
  while (index >= 0) {
    var c = v.charAt(++index);
    switch (c) {
      case '\'':
        buffer += '\'';
        break;
      case '"':
        buffer += '"';
        break;
      case '\\':
        buffer += '\\';
        break;
      case '/':
        buffer += '/';
        break;
      case 'b':
        buffer += '\b';
        break;
      case 'f':
        buffer += '\f';
        break;
      case 'n':
        buffer += '\n';
        break;
      case 'r':
        buffer += '\r';
        break;
      case 't':
        buffer += '\t';
        break;
      case 'u':
        // interpret the following 4 characters as the hex of the unicode code point
        var codePoint = v.substring(index + 1, index + 5);
        if (!codePointPattern.test(codePoint)) {
          this.parseError('Illegal escape sequence: \\u' + codePoint);
        }
        buffer += String.fromCharCode(parseInt(codePoint, 16));
        index += 4;
        break;
      default:
        throw this.parseError('Illegal escape sequence: "\\' + c + '"');
    }
    ++index;
    var backslash = v.indexOf('\\', index);
    buffer += v.substring(index, backslash < 0 ? v.length : backslash);
    index = backslash;
  }

  return buffer;
};

TokenStream.prototype.isComment = function () {
  var c = this.expression.charAt(this.pos);
  if (c === '/' && this.expression.charAt(this.pos + 1) === '*') {
    this.pos = this.expression.indexOf('*/', this.pos) + 2;
    if (this.pos === 1) {
      this.pos = this.expression.length;
    }
    return true;
  }
  return false;
};

TokenStream.prototype.isRadixInteger = function () {
  var pos = this.pos;

  if (pos >= this.expression.length - 2 || this.expression.charAt(pos) !== '0') {
    return false;
  }
  ++pos;

  var radix;
  var validDigit;
  if (this.expression.charAt(pos) === 'x') {
    radix = 16;
    validDigit = /^[0-9a-f]$/i;
    ++pos;
  } else if (this.expression.charAt(pos) === 'b') {
    radix = 2;
    validDigit = /^[01]$/i;
    ++pos;
  } else {
    return false;
  }

  var valid = false;
  var startPos = pos;

  while (pos < this.expression.length) {
    var c = this.expression.charAt(pos);
    if (validDigit.test(c)) {
      pos++;
      valid = true;
    } else {
      break;
    }
  }

  if (valid) {
    this.current = this.newToken(TNUMBER, parseInt(this.expression.substring(startPos, pos), radix));
    this.pos = pos;
  }
  return valid;
};

TokenStream.prototype.isNumber = function () {
  var valid = false;
  var pos = this.pos;
  var startPos = pos;
  var resetPos = pos;
  var foundDot = false;
  var foundDigits = false;
  var c;

  while (pos < this.expression.length) {
    c = this.expression.charAt(pos);
    if ((c >= '0' && c <= '9') || (!foundDot && c === '.')) {
      if (c === '.') {
        foundDot = true;
      } else {
        foundDigits = true;
      }
      pos++;
      valid = foundDigits;
    } else {
      break;
    }
  }

  if (valid) {
    resetPos = pos;
  }

  if (c === 'e' || c === 'E') {
    pos++;
    var acceptSign = true;
    var validExponent = false;
    while (pos < this.expression.length) {
      c = this.expression.charAt(pos);
      if (acceptSign && (c === '+' || c === '-')) {
        acceptSign = false;
      } else if (c >= '0' && c <= '9') {
        validExponent = true;
        acceptSign = false;
      } else {
        break;
      }
      pos++;
    }

    if (!validExponent) {
      pos = resetPos;
    }
  }

  if (valid) {
    this.current = this.newToken(TNUMBER, parseFloat(this.expression.substring(startPos, pos)));
    this.pos = pos;
  } else {
    this.pos = resetPos;
  }
  return valid;
};

TokenStream.prototype.isOperator = function () {
  var startPos = this.pos;
  var c = this.expression.charAt(this.pos);

  if (c === '+' || c === '-' || c === '*' || c === '/' || c === '%' || c === '^' || c === '?' || c === ':' || c === '.') {
    this.current = this.newToken(TOP, c);
  } else if (c === '∙' || c === '•') {
    this.current = this.newToken(TOP, '*');
  } else if (c === '>') {
    if (this.expression.charAt(this.pos + 1) === '=') {
      this.current = this.newToken(TOP, '>=');
      this.pos++;
    } else {
      this.current = this.newToken(TOP, '>');
    }
  } else if (c === '<') {
    if (this.expression.charAt(this.pos + 1) === '=') {
      this.current = this.newToken(TOP, '<=');
      this.pos++;
    } else {
      this.current = this.newToken(TOP, '<');
    }
  } else if (c === '|') {
    if (this.expression.charAt(this.pos + 1) === '|') {
      this.current = this.newToken(TOP, '||');
      this.pos++;
    } else {
      return false;
    }
  } else if (c === '=') {
    if (this.expression.charAt(this.pos + 1) === '=') {
      this.current = this.newToken(TOP, '==');
      this.pos++;
    } else {
      this.current = this.newToken(TOP, c);
    }
  } else if (c === '!') {
    if (this.expression.charAt(this.pos + 1) === '=') {
      this.current = this.newToken(TOP, '!=');
      this.pos++;
    } else {
      this.current = this.newToken(TOP, c);
    }
  } else {
    return false;
  }
  this.pos++;

  if (this.isOperatorEnabled(this.current.value)) {
    return true;
  } else {
    this.pos = startPos;
    return false;
  }
};

TokenStream.prototype.isOperatorEnabled = function (op) {
  return this.parser.isOperatorEnabled(op);
};

TokenStream.prototype.getCoordinates = function () {
  var line = 0;
  var column;
  var newline = -1;
  do {
    line++;
    column = this.pos - newline;
    newline = this.expression.indexOf('\n', newline + 1);
  } while (newline >= 0 && newline < this.pos);

  return {
    line: line,
    column: column
  };
};

TokenStream.prototype.parseError = function (msg) {
  var coords = this.getCoordinates();
  throw new Error('parse error [' + coords.line + ':' + coords.column + ']: ' + msg);
};

function ParserState(parser, tokenStream, options) {
  this.parser = parser;
  this.tokens = tokenStream;
  this.current = null;
  this.nextToken = null;
  this.next();
  this.savedCurrent = null;
  this.savedNextToken = null;
  this.allowMemberAccess = options.allowMemberAccess !== false;
}

ParserState.prototype.next = function () {
  this.current = this.nextToken;
  return (this.nextToken = this.tokens.next());
};

ParserState.prototype.tokenMatches = function (token, value) {
  if (typeof value === 'undefined') {
    return true;
  } else if (Array.isArray(value)) {
    return contains(value, token.value);
  } else if (typeof value === 'function') {
    return value(token);
  } else {
    return token.value === value;
  }
};

ParserState.prototype.save = function () {
  this.savedCurrent = this.current;
  this.savedNextToken = this.nextToken;
  this.tokens.save();
};

ParserState.prototype.restore = function () {
  this.tokens.restore();
  this.current = this.savedCurrent;
  this.nextToken = this.savedNextToken;
};

ParserState.prototype.accept = function (type, value) {
  if (this.nextToken.type === type && this.tokenMatches(this.nextToken, value)) {
    this.next();
    return true;
  }
  return false;
};

ParserState.prototype.expect = function (type, value) {
  if (!this.accept(type, value)) {
    var coords = this.tokens.getCoordinates();
    throw new Error('parse error [' + coords.line + ':' + coords.column + ']: Expected ' + (value || type));
  }
};

ParserState.prototype.parseAtom = function (instr) {
  var unaryOps = this.tokens.unaryOps;
  function isPrefixOperator(token) {
    return token.value in unaryOps;
  }

  if (this.accept(TNAME) || this.accept(TOP, isPrefixOperator)) {
    instr.push(new Instruction(IVAR, this.current.value));
  } else if (this.accept(TNUMBER)) {
    instr.push(new Instruction(INUMBER, this.current.value));
  } else if (this.accept(TSTRING)) {
    instr.push(new Instruction(INUMBER, this.current.value));
  } else if (this.accept(TPAREN, '(')) {
    this.parseExpression(instr);
    this.expect(TPAREN, ')');
  } else if (this.accept(TBRACKET, '[')) {
    if (this.accept(TBRACKET, ']')) {
      instr.push(new Instruction(IARRAY, 0));
    } else {
      var argCount = this.parseArrayList(instr);
      instr.push(new Instruction(IARRAY, argCount));
    }
  } else {
    throw new Error('unexpected ' + this.nextToken);
  }
};

ParserState.prototype.parseExpression = function (instr) {
  var exprInstr = [];
  if (this.parseUntilEndStatement(instr, exprInstr)) {
    return;
  }
  this.parseVariableAssignmentExpression(exprInstr);
  if (this.parseUntilEndStatement(instr, exprInstr)) {
    return;
  }
  this.pushExpression(instr, exprInstr);
};

ParserState.prototype.pushExpression = function (instr, exprInstr) {
  for (var i = 0, len = exprInstr.length; i < len; i++) {
    instr.push(exprInstr[i]);
  }
};

ParserState.prototype.parseUntilEndStatement = function (instr, exprInstr) {
  if (!this.accept(TSEMICOLON)) return false;
  if (this.nextToken && this.nextToken.type !== TEOF && !(this.nextToken.type === TPAREN && this.nextToken.value === ')')) {
    exprInstr.push(new Instruction(IENDSTATEMENT));
  }
  if (this.nextToken.type !== TEOF) {
    this.parseExpression(exprInstr);
  }
  instr.push(new Instruction(IEXPR, exprInstr));
  return true;
};

ParserState.prototype.parseArrayList = function (instr) {
  var argCount = 0;

  while (!this.accept(TBRACKET, ']')) {
    this.parseExpression(instr);
    ++argCount;
    while (this.accept(TCOMMA)) {
      this.parseExpression(instr);
      ++argCount;
    }
  }

  return argCount;
};

ParserState.prototype.parseVariableAssignmentExpression = function (instr) {
  this.parseConditionalExpression(instr);
  while (this.accept(TOP, '=')) {
    var varName = instr.pop();
    var varValue = [];
    var lastInstrIndex = instr.length - 1;
    if (varName.type === IFUNCALL) {
      if (!this.tokens.isOperatorEnabled('()=')) {
        throw new Error('function definition is not permitted');
      }
      for (var i = 0, len = varName.value + 1; i < len; i++) {
        var index = lastInstrIndex - i;
        if (instr[index].type === IVAR) {
          instr[index] = new Instruction(IVARNAME, instr[index].value);
        }
      }
      this.parseVariableAssignmentExpression(varValue);
      instr.push(new Instruction(IEXPR, varValue));
      instr.push(new Instruction(IFUNDEF, varName.value));
      continue;
    }
    if (varName.type !== IVAR && varName.type !== IMEMBER) {
      throw new Error('expected variable for assignment');
    }
    this.parseVariableAssignmentExpression(varValue);
    instr.push(new Instruction(IVARNAME, varName.value));
    instr.push(new Instruction(IEXPR, varValue));
    instr.push(binaryInstruction('='));
  }
};

ParserState.prototype.parseConditionalExpression = function (instr) {
  this.parseOrExpression(instr);
  while (this.accept(TOP, '?')) {
    var trueBranch = [];
    var falseBranch = [];
    this.parseConditionalExpression(trueBranch);
    this.expect(TOP, ':');
    this.parseConditionalExpression(falseBranch);
    instr.push(new Instruction(IEXPR, trueBranch));
    instr.push(new Instruction(IEXPR, falseBranch));
    instr.push(ternaryInstruction('?'));
  }
};

ParserState.prototype.parseOrExpression = function (instr) {
  this.parseAndExpression(instr);
  while (this.accept(TOP, 'or')) {
    var falseBranch = [];
    this.parseAndExpression(falseBranch);
    instr.push(new Instruction(IEXPR, falseBranch));
    instr.push(binaryInstruction('or'));
  }
};

ParserState.prototype.parseAndExpression = function (instr) {
  this.parseComparison(instr);
  while (this.accept(TOP, 'and')) {
    var trueBranch = [];
    this.parseComparison(trueBranch);
    instr.push(new Instruction(IEXPR, trueBranch));
    instr.push(binaryInstruction('and'));
  }
};

var COMPARISON_OPERATORS = ['==', '!=', '<', '<=', '>=', '>', 'in'];

ParserState.prototype.parseComparison = function (instr) {
  this.parseAddSub(instr);
  while (this.accept(TOP, COMPARISON_OPERATORS)) {
    var op = this.current;
    this.parseAddSub(instr);
    instr.push(binaryInstruction(op.value));
  }
};

var ADD_SUB_OPERATORS = ['+', '-', '||'];

ParserState.prototype.parseAddSub = function (instr) {
  this.parseTerm(instr);
  while (this.accept(TOP, ADD_SUB_OPERATORS)) {
    var op = this.current;
    this.parseTerm(instr);
    instr.push(binaryInstruction(op.value));
  }
};

var TERM_OPERATORS = ['*', '/', '%'];

ParserState.prototype.parseTerm = function (instr) {
  this.parseFactor(instr);
  while (this.accept(TOP, TERM_OPERATORS)) {
    var op = this.current;
    this.parseFactor(instr);
    instr.push(binaryInstruction(op.value));
  }
};

ParserState.prototype.parseFactor = function (instr) {
  var unaryOps = this.tokens.unaryOps;
  function isPrefixOperator(token) {
    return token.value in unaryOps;
  }

  this.save();
  if (this.accept(TOP, isPrefixOperator)) {
    if (this.current.value !== '-' && this.current.value !== '+') {
      if (this.nextToken.type === TPAREN && this.nextToken.value === '(') {
        this.restore();
        this.parseExponential(instr);
        return;
      } else if (this.nextToken.type === TSEMICOLON || this.nextToken.type === TCOMMA || this.nextToken.type === TEOF || (this.nextToken.type === TPAREN && this.nextToken.value === ')')) {
        this.restore();
        this.parseAtom(instr);
        return;
      }
    }

    var op = this.current;
    this.parseFactor(instr);
    instr.push(unaryInstruction(op.value));
  } else {
    this.parseExponential(instr);
  }
};

ParserState.prototype.parseExponential = function (instr) {
  this.parsePostfixExpression(instr);
  while (this.accept(TOP, '^')) {
    this.parseFactor(instr);
    instr.push(binaryInstruction('^'));
  }
};

ParserState.prototype.parsePostfixExpression = function (instr) {
  this.parseFunctionCall(instr);
  while (this.accept(TOP, '!')) {
    instr.push(unaryInstruction('!'));
  }
};

ParserState.prototype.parseFunctionCall = function (instr) {
  var unaryOps = this.tokens.unaryOps;
  function isPrefixOperator(token) {
    return token.value in unaryOps;
  }

  if (this.accept(TOP, isPrefixOperator)) {
    var op = this.current;
    this.parseAtom(instr);
    instr.push(unaryInstruction(op.value));
  } else {
    this.parseMemberExpression(instr);
    while (this.accept(TPAREN, '(')) {
      if (this.accept(TPAREN, ')')) {
        instr.push(new Instruction(IFUNCALL, 0));
      } else {
        var argCount = this.parseArgumentList(instr);
        instr.push(new Instruction(IFUNCALL, argCount));
      }
    }
  }
};

ParserState.prototype.parseArgumentList = function (instr) {
  var argCount = 0;

  while (!this.accept(TPAREN, ')')) {
    this.parseExpression(instr);
    ++argCount;
    while (this.accept(TCOMMA)) {
      this.parseExpression(instr);
      ++argCount;
    }
  }

  return argCount;
};

ParserState.prototype.parseMemberExpression = function (instr) {
  this.parseAtom(instr);
  while (this.accept(TOP, '.') || this.accept(TBRACKET, '[')) {
    var op = this.current;

    if (op.value === '.') {
      if (!this.allowMemberAccess) {
        throw new Error('unexpected ".", member access is not permitted');
      }

      this.expect(TNAME);
      instr.push(new Instruction(IMEMBER, this.current.value));
    } else if (op.value === '[') {
      if (!this.tokens.isOperatorEnabled('[')) {
        throw new Error('unexpected "[]", arrays are disabled');
      }

      this.parseExpression(instr);
      this.expect(TBRACKET, ']');
      instr.push(binaryInstruction('['));
    } else {
      throw new Error('unexpected symbol: ' + op.value);
    }
  }
};

function add(a, b) {
  return Number(a) + Number(b);
}

function sub(a, b) {
  return a - b;
}

function mul(a, b) {
  return a * b;
}

function div(a, b) {
  return a / b;
}

function mod(a, b) {
  return a % b;
}

function concat(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.concat(b);
  }
  return '' + a + b;
}

function equal(a, b) {
  return a === b;
}

function notEqual(a, b) {
  return a !== b;
}

function greaterThan(a, b) {
  return a > b;
}

function lessThan(a, b) {
  return a < b;
}

function greaterThanEqual(a, b) {
  return a >= b;
}

function lessThanEqual(a, b) {
  return a <= b;
}

function andOperator(a, b) {
  return Boolean(a && b);
}

function orOperator(a, b) {
  return Boolean(a || b);
}

function inOperator(a, b) {
  return contains(b, a);
}

function sinh(a) {
  return ((Math.exp(a) - Math.exp(-a)) / 2);
}

function cosh(a) {
  return ((Math.exp(a) + Math.exp(-a)) / 2);
}

function tanh(a) {
  if (a === Infinity) return 1;
  if (a === -Infinity) return -1;
  return (Math.exp(a) - Math.exp(-a)) / (Math.exp(a) + Math.exp(-a));
}

function asinh(a) {
  if (a === -Infinity) return a;
  return Math.log(a + Math.sqrt((a * a) + 1));
}

function acosh(a) {
  return Math.log(a + Math.sqrt((a * a) - 1));
}

function atanh(a) {
  return (Math.log((1 + a) / (1 - a)) / 2);
}

function log10(a) {
  return Math.log(a) * Math.LOG10E;
}

function neg(a) {
  return -a;
}

function not(a) {
  return !a;
}

function trunc(a) {
  return a < 0 ? Math.ceil(a) : Math.floor(a);
}

function random(a) {
  return Math.random() * (a || 1);
}

function factorial(a) { // a!
  return gamma(a + 1);
}

function isInteger(value) {
  return isFinite(value) && (value === Math.round(value));
}

var GAMMA_G = 4.7421875;
var GAMMA_P = [
  0.99999999999999709182,
  57.156235665862923517, -59.597960355475491248,
  14.136097974741747174, -0.49191381609762019978,
  0.33994649984811888699e-4,
  0.46523628927048575665e-4, -0.98374475304879564677e-4,
  0.15808870322491248884e-3, -0.21026444172410488319e-3,
  0.21743961811521264320e-3, -0.16431810653676389022e-3,
  0.84418223983852743293e-4, -0.26190838401581408670e-4,
  0.36899182659531622704e-5
];

// Gamma function from math.js
function gamma(n) {
  var t, x;

  if (isInteger(n)) {
    if (n <= 0) {
      return isFinite(n) ? Infinity : NaN;
    }

    if (n > 171) {
      return Infinity; // Will overflow
    }

    var value = n - 2;
    var res = n - 1;
    while (value > 1) {
      res *= value;
      value--;
    }

    if (res === 0) {
      res = 1; // 0! is per definition 1
    }

    return res;
  }

  if (n < 0.5) {
    return Math.PI / (Math.sin(Math.PI * n) * gamma(1 - n));
  }

  if (n >= 171.35) {
    return Infinity; // will overflow
  }

  if (n > 85.0) { // Extended Stirling Approx
    var twoN = n * n;
    var threeN = twoN * n;
    var fourN = threeN * n;
    var fiveN = fourN * n;
    return Math.sqrt(2 * Math.PI / n) * Math.pow((n / Math.E), n) *
      (1 + (1 / (12 * n)) + (1 / (288 * twoN)) - (139 / (51840 * threeN)) -
      (571 / (2488320 * fourN)) + (163879 / (209018880 * fiveN)) +
      (5246819 / (75246796800 * fiveN * n)));
  }

  --n;
  x = GAMMA_P[0];
  for (var i = 1; i < GAMMA_P.length; ++i) {
    x += GAMMA_P[i] / (n + i);
  }

  t = n + GAMMA_G + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
}

function stringOrArrayLength(s) {
  if (Array.isArray(s)) {
    return s.length;
  }
  return String(s).length;
}

function hypot() {
  var sum = 0;
  var larg = 0;
  for (var i = 0; i < arguments.length; i++) {
    var arg = Math.abs(arguments[i]);
    var div;
    if (larg < arg) {
      div = larg / arg;
      sum = (sum * div * div) + 1;
      larg = arg;
    } else if (arg > 0) {
      div = arg / larg;
      sum += div * div;
    } else {
      sum += arg;
    }
  }
  return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
}

function condition(cond, yep, nope) {
  return cond ? yep : nope;
}

/**
* Decimal adjustment of a number.
* From @escopecz.
*
* @param {Number} value The number.
* @param {Integer} exp  The exponent (the 10 logarithm of the adjustment base).
* @return {Number} The adjusted value.
*/
function roundTo(value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math.round(value);
  }
  value = +value;
  exp = -(+exp);
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

function setVar(name, value, variables) {
  if (variables) variables[name] = value;
  return value;
}

function arrayIndex(array, index) {
  return array[index | 0];
}

function max(array) {
  if (arguments.length === 1 && Array.isArray(array)) {
    return Math.max.apply(Math, array);
  } else {
    return Math.max.apply(Math, arguments);
  }
}

function min(array) {
  if (arguments.length === 1 && Array.isArray(array)) {
    return Math.min.apply(Math, array);
  } else {
    return Math.min.apply(Math, arguments);
  }
}

function arrayMap(f, a) {
  if (typeof f !== 'function') {
    throw new Error('First argument to map is not a function');
  }
  if (!Array.isArray(a)) {
    throw new Error('Second argument to map is not an array');
  }
  return a.map(function (x, i) {
    return f(x, i);
  });
}

function arrayFold(f, init, a) {
  if (typeof f !== 'function') {
    throw new Error('First argument to fold is not a function');
  }
  if (!Array.isArray(a)) {
    throw new Error('Second argument to fold is not an array');
  }
  return a.reduce(function (acc, x, i) {
    return f(acc, x, i);
  }, init);
}

function arrayFilter(f, a) {
  if (typeof f !== 'function') {
    throw new Error('First argument to filter is not a function');
  }
  if (!Array.isArray(a)) {
    throw new Error('Second argument to filter is not an array');
  }
  return a.filter(function (x, i) {
    return f(x, i);
  });
}

function stringOrArrayIndexOf(target, s) {
  if (!(Array.isArray(s) || typeof s === 'string')) {
    throw new Error('Second argument to indexOf is not a string or array');
  }

  return s.indexOf(target);
}

function arrayJoin(sep, a) {
  if (!Array.isArray(a)) {
    throw new Error('Second argument to join is not an array');
  }

  return a.join(sep);
}

function sign(x) {
  return ((x > 0) - (x < 0)) || +x;
}

var ONE_THIRD = 1/3;
function cbrt(x) {
  return x < 0 ? -Math.pow(-x, ONE_THIRD) : Math.pow(x, ONE_THIRD);
}

function expm1(x) {
  return Math.exp(x) - 1;
}

function log1p(x) {
  return Math.log(1 + x);
}

function log2(x) {
  return Math.log(x) / Math.LN2;
}

function Parser(options) {
  this.options = options || {};
  this.unaryOps = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sinh: Math.sinh || sinh,
    cosh: Math.cosh || cosh,
    tanh: Math.tanh || tanh,
    asinh: Math.asinh || asinh,
    acosh: Math.acosh || acosh,
    atanh: Math.atanh || atanh,
    sqrt: Math.sqrt,
    cbrt: Math.cbrt || cbrt,
    log: Math.log,
    log2: Math.log2 || log2,
    ln: Math.log,
    lg: Math.log10 || log10,
    log10: Math.log10 || log10,
    expm1: Math.expm1 || expm1,
    log1p: Math.log1p || log1p,
    abs: Math.abs,
    ceil: Math.ceil,
    floor: Math.floor,
    round: Math.round,
    trunc: Math.trunc || trunc,
    '-': neg,
    '+': Number,
    exp: Math.exp,
    not: not,
    length: stringOrArrayLength,
    '!': factorial,
    sign: Math.sign || sign
  };

  this.binaryOps = {
    '+': add,
    '-': sub,
    '*': mul,
    '/': div,
    '%': mod,
    '^': Math.pow,
    '||': concat,
    '==': equal,
    '!=': notEqual,
    '>': greaterThan,
    '<': lessThan,
    '>=': greaterThanEqual,
    '<=': lessThanEqual,
    and: andOperator,
    or: orOperator,
    'in': inOperator,
    '=': setVar,
    '[': arrayIndex
  };

  this.ternaryOps = {
    '?': condition
  };

  this.functions = {
    random: random,
    fac: factorial,
    min: min,
    max: max,
    hypot: Math.hypot || hypot,
    pyt: Math.hypot || hypot, // backward compat
    pow: Math.pow,
    atan2: Math.atan2,
    'if': condition,
    gamma: gamma,
    roundTo: roundTo,
    map: arrayMap,
    fold: arrayFold,
    filter: arrayFilter,
    indexOf: stringOrArrayIndexOf,
    join: arrayJoin
  };

  this.consts = {
    E: Math.E,
    PI: Math.PI,
    'true': true,
    'false': false
  };
}

Parser.prototype.parse = function (expr) {
  var instr = [];
  var parserState = new ParserState(
    this,
    new TokenStream(this, expr),
    { allowMemberAccess: this.options.allowMemberAccess }
  );

  parserState.parseExpression(instr);
  parserState.expect(TEOF, 'EOF');

  return new Expression(instr, this);
};

Parser.prototype.evaluate = function (expr, variables) {
  return this.parse(expr).evaluate(variables);
};

var sharedParser = new Parser();

Parser.parse = function (expr) {
  return sharedParser.parse(expr);
};

Parser.evaluate = function (expr, variables) {
  return sharedParser.parse(expr).evaluate(variables);
};

var optionNameMap = {
  '+': 'add',
  '-': 'subtract',
  '*': 'multiply',
  '/': 'divide',
  '%': 'remainder',
  '^': 'power',
  '!': 'factorial',
  '<': 'comparison',
  '>': 'comparison',
  '<=': 'comparison',
  '>=': 'comparison',
  '==': 'comparison',
  '!=': 'comparison',
  '||': 'concatenate',
  'and': 'logical',
  'or': 'logical',
  'not': 'logical',
  '?': 'conditional',
  ':': 'conditional',
  '=': 'assignment',
  '[': 'array',
  '()=': 'fndef'
};

function getOptionName(op) {
  return optionNameMap.hasOwnProperty(op) ? optionNameMap[op] : op;
}

Parser.prototype.isOperatorEnabled = function (op) {
  var optionName = getOptionName(op);
  var operators = this.options.operators || {};

  return !(optionName in operators) || !!operators[optionName];
};

/*!
 Based on ndef.parser, by Raphael Graf(r@undefined.ch)
 http://www.undefined.ch/mparser/index.html

 Ported to JavaScript and modified by Matthew Crumley (email@matthewcrumley.com, http://silentmatt.com/)

 You are free to use and modify this code in anyway you find useful. Please leave this comment in the code
 to acknowledge its original source. If you feel like it, I enjoy hearing about projects that use my code,
 but don't feel like you have to let me know or ask permission.
*/

// Backwards compatibility
var index = {
  Parser: Parser,
  Expression: Expression
};

/* harmony default export */ __webpack_exports__["default"] = (index);



/***/ }),

/***/ "./src/calculate.js":
/*!**************************!*\
  !*** ./src/calculate.js ***!
  \**************************/
/*! exports provided: addCalculateTabListeners, renderCalculateTab */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addCalculateTabListeners", function() { return addCalculateTabListeners; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderCalculateTab", function() { return renderCalculateTab; });
/* harmony import */ var _functionParsing_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functionParsing.js */ "./src/functionParsing.js");
/* harmony import */ var _rendering_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rendering.js */ "./src/rendering.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./math.js */ "./src/math.js");




function calculateRoot(f, guess) {
  let root = newtonsMethod(f, guess);
  let expr = Object(_functionParsing_js__WEBPACK_IMPORTED_MODULE_0__["parseFunction"])(f);
  if (Math.abs(expr.evaluate({x: root})) < Math.pow(10, -10)) {
    return root;
  } else {
    return null;
  }
}

// Calculate the intercections of two graphs, f and g, by calculating the root of f - g.
function calculateIntersection(f1, f2, guess, depth = 100) {
  let expr1 = Object(_functionParsing_js__WEBPACK_IMPORTED_MODULE_0__["parseFunction"])(f1);
  let expr2 = Object(_functionParsing_js__WEBPACK_IMPORTED_MODULE_0__["parseFunction"])(f2);

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
  let expr = Object(_functionParsing_js__WEBPACK_IMPORTED_MODULE_0__["parseFunction"])(f);
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
    for (let key in _rendering_js__WEBPACK_IMPORTED_MODULE_1__["view"].functions) {
      enteredFunction = true;
      let optionElement = document.createElement('option');
      let expression = _rendering_js__WEBPACK_IMPORTED_MODULE_1__["view"].functions[key].expression;
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
      outputDiv.textContent = `Root: (${Object(_math_js__WEBPACK_IMPORTED_MODULE_2__["roundValue"])(root, 6)}, 0)`;
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
      outputDiv.textContent = `Intersection: (${Object(_math_js__WEBPACK_IMPORTED_MODULE_2__["roundValue"])(intersection.x, 6)}, ${Object(_math_js__WEBPACK_IMPORTED_MODULE_2__["roundValue"])(intersection.y, 6)})`;
    } else {
      outputDiv.textContent = 'Intersection not found or graphs are equivalent';
    }
  });
}




/***/ }),

/***/ "./src/drawing.js":
/*!************************!*\
  !*** ./src/drawing.js ***!
  \************************/
/*! exports provided: Draw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Draw", function() { return Draw; });
// Drawing module
function Draw(canvas) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
}

Draw.prototype.fill = function(color) {
  this.canvas.fillStyle = color;
}

Draw.prototype.line = function(x1, y1, x2, y2, color = 'black') {
  this.ctx.beginPath();
  this.ctx.moveTo(x1, y1);
  this.ctx.lineTo(x2, y2);
  this.ctx.strokeStyle = color;
  this.ctx.stroke();
}

Draw.prototype.text = function(string, x, y, size = 10 * canvas.scale) {
  this.ctx.font = size + 'px Arial';
  this.ctx.fillText(string, x, y);
}

Draw.prototype.rect = function(x, y, width, height, color = 'white') {
  this.ctx.fillStyle = color;
  this.ctx.fillRect(x, y, width, height);
}

Draw.prototype.colorCircle = function(centerX, centerY, radius, color = 'black') {
  this.ctx.fillStyle = color;
  this.ctx.beginPath();
  this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  this.ctx.fill();
}




/***/ }),

/***/ "./src/eventHandling.js":
/*!******************************!*\
  !*** ./src/eventHandling.js ***!
  \******************************/
/*! exports provided: eventHandling, renderTab */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eventHandling", function() { return eventHandling; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderTab", function() { return renderTab; });
/* harmony import */ var _rendering_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rendering.js */ "./src/rendering.js");
/* harmony import */ var _functionParsing_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./functionParsing.js */ "./src/functionParsing.js");
/* harmony import */ var _calculate_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./calculate.js */ "./src/calculate.js");




let isDragging = false;
let numOfFunctions = 0;
let draggedPoint;

function mousePos(e) {
  let rect = _rendering_js__WEBPACK_IMPORTED_MODULE_0__["canvas"].getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * _rendering_js__WEBPACK_IMPORTED_MODULE_0__["canvas"].width/(rect.right - rect.left),
    y: (e.clientY - rect.top) * _rendering_js__WEBPACK_IMPORTED_MODULE_0__["canvas"].height/(rect.bottom - rect.top)
  };
}

// px to units
function toUnitCoord(x, y) {
  let graphWidth = _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMax - _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMin;
  let graphHeight = _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMax - _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMin;
  return {
    x: _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMin + (x/(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["canvas"].width)) * graphWidth,
    y: _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMax - (y/(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["canvas"].height)) * graphHeight
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
      let functionObject = _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].functions[functionName] = {};
      functionObject.expression = functionInput.value;
      functionObject.color = document.querySelector(`.functions select[name="${functionName}"]`).value;
    } else {
      delete _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].functions[functionName];
    }
  }
  Object(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["render"])();
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
    Object(_calculate_js__WEBPACK_IMPORTED_MODULE_2__["renderCalculateTab"])();
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
  _rendering_js__WEBPACK_IMPORTED_MODULE_0__["canvas"].addEventListener('mousedown', function(e) {
    draggedPoint = mousePos(e);
    isDragging = true;
    let currentPos = mousePos(e);
    Object(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["render"])();
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
  });

  // Handles dragging; moves window opposite of dragged direction
  _rendering_js__WEBPACK_IMPORTED_MODULE_0__["canvas"].addEventListener('mousemove', function(e) {
    if (isDragging) {

      let currentPos = mousePos(e);
      let xDiff = toUnitCoord(currentPos.x, 0).x - toUnitCoord(draggedPoint.x, 0).x;
      let yDiff = toUnitCoord(0, currentPos.y).y - toUnitCoord(0, draggedPoint.y).y;

      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMin -= xDiff;
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMax -= xDiff;
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMin -= yDiff;
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMax -= yDiff;

      draggedPoint = currentPos;
      Object(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["render"])();
    }
  });

  // Zooming in and out
  _rendering_js__WEBPACK_IMPORTED_MODULE_0__["canvas"].addEventListener('wheel', function(e) {
    e.preventDefault();
    let currentPos = mousePos(e);
    let gridPos = toUnitCoord(currentPos.x, currentPos.y);

    let distFromLeft = gridPos.x - _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMin;
    let distFromRight = _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMax - gridPos.x;
    let distFromTop = _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMax - gridPos.y;
    let distFromBottom = gridPos.y - _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMin;
    let factor = 0.05;
    // zoom out
    if (e.deltaY > 0) {
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMin -= distFromLeft * factor;
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMax += distFromRight * factor;
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMin -= distFromBottom * factor;
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMax += distFromTop * factor;
    }
    // zoom in
    else if (e.deltaY < 0) {
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMin += distFromLeft * factor;
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMax -= distFromRight * factor;
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMin += distFromBottom * factor;
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMax -= distFromTop * factor;
    }
    Object(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["render"])();
  });

  // Trace functionality; show the point on a graph closest to the cursor
  _rendering_js__WEBPACK_IMPORTED_MODULE_0__["canvas"].addEventListener('mousemove', function(e) {
    let mousePosX = toUnitCoord(mousePos(e).x, 0).x;
    let mousePosY = toUnitCoord(0, mousePos(e).y).y;
    let pointY;
    let pointColor;
    for (let key in _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].functions) {
      let expr = Object(_functionParsing_js__WEBPACK_IMPORTED_MODULE_1__["parseFunction"])(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].functions[key].expression);
      let y = expr.evaluate({x: mousePosX});
      if (y > _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMin && y < _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMax && Math.abs(mousePos(e).y - Object(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["toPixelCoord"])(0, y).y) < 50) {
        if (!pointY || Math.abs(y - mousePosY) < Math.abs(pointY - mousePosY)) {
          pointY = y
          pointColor = _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].functions[key].color;
        }
      }
    }
    // Draw point
    if (pointY && pointColor) {
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].point.x = mousePosX;
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].point.y = pointY;
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].point.color = pointColor;
    } else {
      _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].point = {};
    }
    Object(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["render"])();
  });

  _rendering_js__WEBPACK_IMPORTED_MODULE_0__["canvas"].onmouseout = function() {
    _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].point = {};
    Object(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["render"])();
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
        _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMax = parseFloat(xMax);
        _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMin = parseFloat(xMin);
      }

      if (yMin && yMax && parseFloat(yMin) < parseFloat(yMax)) {
        _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMax = parseFloat(yMax);
        _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMin = parseFloat(yMin);
      }

      if (xScale && xScale > 0) {
        _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xScale = xScale;
      } else {
        _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xScale = 4;
      }
      if (yScale && yScale > 0) {
        _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yScale = yScale;
      } else {
        _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yScale = 4;
      }
      Object(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["render"])();
    });
  }

  document.querySelector('button[class="clear-window"]').addEventListener('click', function() {
    for (let i = 0; i < windowElements.length; i++) {
      document.querySelector(`input[name="${windowElements[i]}"]`).value = '';
    }
  });

  document.querySelector('button[class="reset-window"]').addEventListener('click', function() {
    _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMin = -22.5;
    _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMax = 22.5;
    _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMin = -22.5;
    _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yMax = 22.5;
    _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xScale = 4;
    _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].yScale = 4;
    Object(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["render"])();
  });

  // render tabs
  let tabList = ['function', 'table', 'calculate'];
  for (let i = 0; i < tabList.length; i++) {
    document.querySelector(`.${tabList[i]}-nav`).addEventListener('click', function() {
      renderTab(tabList[i]);
    });
  }
  Object(_calculate_js__WEBPACK_IMPORTED_MODULE_2__["addCalculateTabListeners"])();

  let tabListNav = ['home', 'about'];
  for (let i = 0; i < tabListNav.length; i++) {
    document.querySelector(`#${tabListNav[i]}`).addEventListener('click', function() {
      renderNavBarTab(tabListNav[i]);
    });
  }
}




/***/ }),

/***/ "./src/functionParsing.js":
/*!********************************!*\
  !*** ./src/functionParsing.js ***!
  \********************************/
/*! exports provided: parseFunction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseFunction", function() { return parseFunction; });
// https://github.com/silentmatt/expr-eval/tree/master
let Parser = __webpack_require__(/*! expr-eval */ "./node_modules/expr-eval/dist/index.mjs").Parser;

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




/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rendering_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rendering.js */ "./src/rendering.js");
/* harmony import */ var _eventHandling_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./eventHandling.js */ "./src/eventHandling.js");



Object(_eventHandling_js__WEBPACK_IMPORTED_MODULE_1__["renderTab"])('function');
Object(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["render"])();
Object(_eventHandling_js__WEBPACK_IMPORTED_MODULE_1__["eventHandling"])();


/***/ }),

/***/ "./src/math.js":
/*!*********************!*\
  !*** ./src/math.js ***!
  \*********************/
/*! exports provided: roundValue */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "roundValue", function() { return roundValue; });
function roundValue(number, precision = 3) {
  if (Math.abs(number) == Infinity || number == NaN) {
    return '';
  }
  if (number == 0) {
    return 0;
  }
  if (Math.abs(number) <= 0.0001) {
    return parseFloat((number).toPrecision(precision)).toExponential().replace('e', '*10^');
  }
  if (Math.abs(number) >= 100000) {
    return number.toPrecision(precision).replace('e+', '*10^');
  }
  if (Math.abs(number) < 100000) {
    return parseFloat((number).toPrecision(precision));
  }
}




/***/ }),

/***/ "./src/rendering.js":
/*!**************************!*\
  !*** ./src/rendering.js ***!
  \**************************/
/*! exports provided: canvas, ctx, draw, render, view, toPixelCoord, findAutoScale */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "canvas", function() { return canvas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ctx", function() { return ctx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "draw", function() { return draw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "view", function() { return view; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toPixelCoord", function() { return toPixelCoord; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findAutoScale", function() { return findAutoScale; });
/* harmony import */ var _drawing_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./drawing.js */ "./src/drawing.js");
/* harmony import */ var _functionParsing_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./functionParsing.js */ "./src/functionParsing.js");
/* harmony import */ var _table_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./table.js */ "./src/table.js");
// Problem: computers with bigger monitors




let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// Increase canvas resolution
canvas.scale = 2;
canvas.width *= canvas.scale;
canvas.height *= canvas.scale;

let draw = new _drawing_js__WEBPACK_IMPORTED_MODULE_0__["Draw"](canvas);
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
      drawGraph(Object(_functionParsing_js__WEBPACK_IMPORTED_MODULE_1__["parseFunction"])(view.functions[key].expression), view.functions[key].color);
    } catch(e) {
      console.log(view.functions[key].expression + ' is not a valid function.')
    }
  }
  // Draws point on graph closest to cursor
  drawPoint(view.point.x, view.point.y, view.point.color);
  Object(_table_js__WEBPACK_IMPORTED_MODULE_2__["renderTable"])();
}




/***/ }),

/***/ "./src/table.js":
/*!**********************!*\
  !*** ./src/table.js ***!
  \**********************/
/*! exports provided: renderTable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderTable", function() { return renderTable; });
/* harmony import */ var _rendering_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rendering.js */ "./src/rendering.js");
/* harmony import */ var _functionParsing_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./functionParsing.js */ "./src/functionParsing.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./math.js */ "./src/math.js");




function renderTable() {
  let tableElement = document.querySelector('table');

  // table headers / labels
  tableElement.innerHTML = '';
  let headerRow = document.createElement('tr');
  let xLabel = document.createElement('th');
  xLabel.textContent = 'x';
  headerRow.appendChild(xLabel);

  // values of tables
  for (let key in _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].functions) {
    let tableHeader = document.createElement('th');
    tableHeader.textContent = key;
    headerRow.appendChild(tableHeader);
  }
  tableElement.appendChild(headerRow);

  let tblMin = Math.ceil(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMin/_rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xScale) * _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xScale;
  let tblMax = Math.floor(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xMax/_rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xScale) * _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xScale;
  let numberOfValues = (tblMax - tblMin)/_rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].xScale;

  for (let i = 0; i <= numberOfValues; i++) {
    let x = tblMin + (tblMax - tblMin) * i/numberOfValues;
    let tableRow = document.createElement('tr');
    let xColumn = document.createElement('td');
    xColumn.textContent = Object(_math_js__WEBPACK_IMPORTED_MODULE_2__["roundValue"])(x);
    tableRow.appendChild(xColumn);

    for (let key in _rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].functions) {
      let yColumn = document.createElement('td');
      let expr = Object(_functionParsing_js__WEBPACK_IMPORTED_MODULE_1__["parseFunction"])(_rendering_js__WEBPACK_IMPORTED_MODULE_0__["view"].functions[key].expression);
      if (!expr) {
        continue
      }
      yColumn.textContent = Object(_math_js__WEBPACK_IMPORTED_MODULE_2__["roundValue"])(expr.evaluate({x}));

      tableRow.appendChild(yColumn);
    }
    tableElement.appendChild(tableRow);
  }
}




/***/ })

/******/ });
//# sourceMappingURL=main.js.map