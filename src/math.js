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

export {roundValue}
