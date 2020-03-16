import { view } from './rendering.js';
import { parseFunction } from './functionParsing.js';
import { roundValue } from './math.js';

function renderTable() {
  let tableElement = document.querySelector('table');

  // table headers / labels
  tableElement.innerHTML = '';
  let headerRow = document.createElement('tr');
  let xLabel = document.createElement('th');
  xLabel.textContent = 'x';
  headerRow.appendChild(xLabel);

  // values of tables
  for (let key in view.functions) {
    let tableHeader = document.createElement('th');
    tableHeader.textContent = key;
    headerRow.appendChild(tableHeader);
  }
  tableElement.appendChild(headerRow);

  let tblMin = Math.ceil(view.xMin/view.xScale) * view.xScale;
  let tblMax = Math.floor(view.xMax/view.xScale) * view.xScale;
  let numberOfValues = (tblMax - tblMin)/view.xScale;

  for (let i = 0; i <= numberOfValues; i++) {
    let x = tblMin + (tblMax - tblMin) * i/numberOfValues;
    let tableRow = document.createElement('tr');
    let xColumn = document.createElement('td');
    xColumn.textContent = roundValue(x);
    tableRow.appendChild(xColumn);

    for (let key in view.functions) {
      let yColumn = document.createElement('td');
      let expr = parseFunction(view.functions[key].expression);
      if (!expr) {
        continue
      }
      yColumn.textContent = roundValue(expr.evaluate({x}));

      tableRow.appendChild(yColumn);
    }
    tableElement.appendChild(tableRow);
  }
}

export { renderTable };
