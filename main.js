!function(e){var t={};function n(i){if(t[i])return t[i].exports;var l=t[i]={i:i,l:!1,exports:{}};return e[i].call(l.exports,l,l.exports,n),l.l=!0,l.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)n.d(i,l,function(t){return e[t]}.bind(null,l));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";function i(e){this.canvas=e,this.ctx=e.getContext("2d")}n.r(t),i.prototype.fill=function(e){this.canvas.fillStyle=e},i.prototype.line=function(e,t,n,i,l="black"){this.ctx.beginPath(),this.ctx.moveTo(e,t),this.ctx.lineTo(n,i),this.ctx.strokeStyle=l,this.ctx.stroke()},i.prototype.text=function(e,t,n,i=10*canvas.scale){this.ctx.font=i+"px Arial",this.ctx.fillText(e,t,n)},i.prototype.rect=function(e,t,n,i,l="white"){this.ctx.fillStyle=l,this.ctx.fillRect(e,t,n,i)};let l=document.getElementById("canvas"),a=l.getContext("2d");l.trueHeight=l.height,l.trueWidth=l.width,l.scale=2,l.style.width=l.width+"px",l.style.height=l.height+"px",l.width*=l.scale,l.height*=l.scale;let x=new i(l),c={xScale:4,yScale:4,xMin:-22.5,xMax:22.5,yMin:-22.5,yMax:22.5};function o(e,t){return{x:(e-c.xMin)/(c.xMax-c.xMin)*l.width,y:(c.yMax-t)/(c.yMax-c.yMin)*l.width}}function r(){let e=function(){let e=c.xScale,t=c.yScale,n=(c.xMax-c.xMin)/e,i=(c.yMax-c.yMin)/t;for(;n>12;)e*=2,n=(c.xMax-c.xMin)/e;for(;n<4;)e/=2,n=(c.xMax-c.xMin)/e;for(;i>12;)t*=2,i=(c.yMax-c.yMin)/t;for(;i<4;)t/=2,i=(c.yMax-c.yMin)/t;return{xScale:e,yScale:t}}();c.xScale=e.xScale,c.yScale=e.yScale,x.rect(0,0,l.width,l.height),function(){a.lineWidth=l.scale;let e={min:Math.ceil(c.xMin/c.xScale),max:Math.floor(c.xMax/c.xScale)},t={min:Math.ceil(c.yMin/c.yScale),max:Math.floor(c.yMax/c.yScale)};for(let t=e.min;t<=e.max;t++){if(0==t)continue;let e=o(t*c.xScale,0).x;o(0,0).y;x.line(e,0,e,l.height,"lightgray")}for(let e=t.min;e<=t.max;e++){if(0==e)continue;o(0,0).x;let t=o(0,e*c.yScale).y;x.line(0,t,l.width,t,"lightgray")}}(),function(){a.fillStyle="black",a.lineWidth=1.5*l.scale,x.line(0,o(0,0).y,l.width,o(0,0).y),x.line(o(0,0).x,0,o(0,0).x,l.height),a.textBaseline="middle";let e={min:Math.ceil(c.xMin/c.xScale),max:Math.floor(c.xMax/c.xScale)};for(let t=e.min;t<=e.max;t++){if(a.textAlign="center",0==t)continue;let e=parseFloat((t*c.xScale).toPrecision(4)),n=o(t*c.xScale,0).x,i=o(0,0).y;x.line(n,i+5*l.scale,n,i-5*l.scale),x.text(e,n,i+15*l.scale)}let t={min:Math.ceil(c.yMin/c.yScale),max:Math.floor(c.yMax/c.yScale)};for(let e=t.min;e<=t.max;e++){if(0==e)continue;a.textAlign="end";let t=parseFloat((e*c.yScale).toPrecision(4)),n=o(0,0).x,i=o(0,e*c.yScale).y;x.line(n-5*l.scale,i,n+5*l.scale,i),x.text(t,n-10*l.scale,i)}}()}let y,u=!1;function f(e){let t=l.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}}function M(e,t){let n=c.xMax-c.xMin,i=c.yMax-c.yMin;return{x:c.xMin+e/l.trueWidth*n,y:c.yMax-t/l.trueHeight*i}}r(),l.addEventListener("mousedown",(function(e){y=f(e),u=!0;let t=f(e);console.log(M(t.x,t.y))})),document.addEventListener("mouseup",(function(){u=!1})),l.addEventListener("mousemove",(function(e){if(u){let t=f(e),n=M(t.x,0).x-M(y.x,0).x,i=M(0,t.y).y-M(0,y.y).y;c.xMin-=n,c.xMax-=n,c.yMin-=i,c.yMax-=i,y=t,r()}})),l.addEventListener("wheel",(function(e){let t=f(e),n=M(t.x,t.y),i=n.x-c.xMin,l=c.xMax-n.x,a=c.yMax-n.y,x=n.y-c.yMin;e.deltaY>0?(c.xMin-=.05*i,c.xMax+=.05*l,c.yMin-=.05*x,c.yMax+=.05*a):e.deltaY<0&&(c.xMin+=.05*i,c.xMax-=.05*l,c.yMin+=.05*x,c.yMax-=.05*a),r(),e.preventDefault()}))}]);