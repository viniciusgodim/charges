var radius = 25;

function createcircle(event) {
  if (event.target.tagName === "HTML") {
    var newCircle = document.createElement('div');
    newCircle.className = 'circle';
    newCircle.style.position = 'absolute';
    newCircle.style.left = event.clientX + 'px';
    newCircle.style.top = event.clientY + 'px';
    newCircle.style.width = 2 * radius + 'px';
    newCircle.style.height = 2 * radius + 'px';
    newCircle.style.borderRadius = radius + 'px';
    newCircle.style.backgroundColor = '#' + Math.random().toString(16).substr(2, 6);
    hasPositiveCharge = document.getElementById("positive").checked;
    isNeuter = document.getElementById("neuter").checked;
    if (!isNeuter) {
      var signSymbol = document.createElement('div')
      signSymbol.className = 'signSymbol'
      if (hasPositiveCharge) {
        signSymbol.innerHTML = '+'
        newCircle.chargeSign = 1
      } else {
        signSymbol.innerHTML = '-'
        newCircle.chargeSign = -1
      }
      newCircle.appendChild(signSymbol);
    } else {
      newCircle.chargeSign = 0;
    }
    document.body.appendChild(newCircle);
  }
}

var dt = 0.05;
var kw = 5;
var m = 1;
var q = 1;
var kc = 2000;
var kv = 0.075;
var g1 = 0.05
var ks = 0.95;
var d0 = 0;

function drop() {
  dropButton = document.getElementById("dropButton");
  document.body.removeChild(dropButton);
  chargeSignForm = document.getElementById("chargeSignForm");
  document.getElementById("chargeSignFormContainer").removeChild(chargeSignForm);
  document.removeEventListener("mousedown", createcircle);
  circles = document.querySelectorAll('.circle')
  circles.forEach(circle => {
    let y = parseInt(circle.style.top);
    let x = parseInt(circle.style.left);
    let u = 0;
    let v = 0;
    let t = 0;
    let call = setInterval(frame, dt);
    circle.count = 0;
    function frame() {
      yw = parseInt(window.innerHeight);
      xw = parseInt(window.innerWidth);
      circle.count += 1;
      if (circle.count > 1) {
        fx0 = circle.fx;
        fy0 = circle.fy;
      }
      fx = 0;
      fy = g1 * m * parseInt(document.getElementById('gravitySlider').value);
      circles.forEach(otherCircle => {
        if (circle != otherCircle) {
          xo = parseInt(otherCircle.style.left);
          yo = parseInt(otherCircle.style.top);
          if (circle.count > 1) {
            d0 = d;
          }
          d = ((x - xo) ** 2 + (y - yo) ** 2) ** .5
          if (d <= 2 * radius) {
            fx = fx + kw * (2 * radius - d) * (x - xo) / d - kv*u*(u**2+v**2)**.5
            fy = fy + kw * (2 * radius - d) * (y - yo) / d - kv*v*(u**2+v**2)**.5
            if (d0 > 2 * radius) {
              rgb1 = circle.style.backgroundColor;
              rgb2 = otherCircle.style.backgroundColor;
              averageColor = getAverageColor(rgb1, rgb2);
              circle.style.backgroundColor = getAverageColor(averageColor, rgb1);
              otherCircle.style.backgroundColor = getAverageColor(averageColor, rgb2);
            }
          }
          mathSign = circle.chargeSign * otherCircle.chargeSign;
          fx = fx + mathSign * kc * q ** 2 * (x - xo) / d ** 3
          fy = fy + mathSign * kc * q ** 2 * (y - yo) / d ** 3
        }
      });
      if (y + radius > yw || y - radius < 0) {
        v = -ks*v
        if (y + radius > 1.1*yw){
          fy = fy - 50*kw*(y + radius - yw) - kv*v*(u**2+v**2)**.5 /2;
        }
        if (y < 0.9*radius){
          fy = fy + 50*kw*(radius - y) - kv*v*(u**2+v**2)**.5 /2;
        }
      }
      if (x + radius > xw || x - radius < 0) {
        u = -ks*u
        if (x + radius > 1.1*xw){
          fx = fx - 50*kw*(x + radius - xw) - kv*u*(u**2+v**2)**.5 /5
        }
        if (x < 0.9*radius){
          fx = fx + 50*kw*(radius - x) - kv*u*(u**2+v**2)**.5 / 5;
        }
      }
      circle.fx = fx;
      circle.fy = fy;
      u0 = u;
      v0 = v;
      if (circle.count == 1) {
        fx0 = fx;
        fy0 = fy;
      }
      u = u + (fx + fx0) / 2 / m * dt;
      v = v + (fy + fy0) / 2 / m * dt;
      x = x + (u0 + u) / 2 * dt;
      y = y + (v0 + v) / 2 * dt;
      circle.newy = y + 'px';
      circle.newx = x + 'px';
      if(circle == circles[circles.length-1]){
        circles.forEach(circleToUpdate => {
          circleToUpdate.style.top = circleToUpdate.newy;
          circleToUpdate.style.left = circleToUpdate.newx;
        });
      }
    }
  });
}

function main() {
  document.addEventListener("mousedown", createcircle);
  document.getElementById("dropButton").addEventListener("click", drop);
}
