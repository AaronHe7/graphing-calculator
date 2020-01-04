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

export { Draw }
