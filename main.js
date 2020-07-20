var radius = 25;

function createcircle(event) {
  if (event.target.id === "mainContainer") {
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
var kw = 1;
var m = 1;
var q = 1;
var kc = 1500;
var kv = 0.05;
var g1 = 0.05;
var ks = 0.95;
var d0 = 0;

function drop() {
  mainContainer = document.getElementById("mainContainer");
  circles = document.querySelectorAll('.circle');
  circles.forEach(circle => {
    circle.oldx = parseInt(circle.style.left);
    circle.oldy = parseInt(circle.style.top);
    circle.oldu = 0;
    circle.oldv = 0;
  });
  circles.forEach(circle => {
    let call = setInterval(frame, dt);
    circle.count = 0;
    function frame() {
      yw = mainContainer.offsetTop + mainContainer.offsetHeight;
      xw = mainContainer.offsetLeft + mainContainer.offsetWidth / 2;
      yw0 = mainContainer.offsetTop;
      xw0 = mainContainer.offsetLeft - mainContainer.offsetWidth / 2;
      circle.count += 1;
      if (circle.count > 1) {
        fx0 = circle.fx;
        fy0 = circle.fy;
      }
      fx = 0;
      fy = g1 * m * parseInt(document.getElementById('gravitySlider').value);
      u = circle.oldu;
      v = circle.oldv;
      x = circle.oldx;
      y = circle.oldy;
      circles.forEach(otherCircle => {
        if (circle != otherCircle) {
          xo = otherCircle.oldx;
          yo = otherCircle.oldy;
          uo = otherCircle.oldu;
          vo = otherCircle.oldv;
          if (circle.count > 1) {
            d0 = d;
          }
          d = ((x - xo) ** 2 + (y - yo) ** 2) ** .5
          if (d <= 2 * radius) {
            fx = fx + kw * (2 * radius - d) * (x - xo) / d - kv * (u-uo)  ;
            fy = fy + kw * (2 * radius - d) * (y - yo) / d - kv * (v-vo)  ;
            if (d0 > 2 * radius) {
              rgb1 = circle.style.backgroundColor;
              rgb2 = otherCircle.style.backgroundColor;
              averageColor = getAverageColor(rgb1, rgb2);
              circle.style.backgroundColor = getAverageColor(averageColor, rgb1);
              otherCircle.style.backgroundColor = getAverageColor(averageColor, rgb2);
            }
          }
          if (!circle.chargeSign == 0){
            mathSign = circle.chargeSign * otherCircle.chargeSign;
            fx = fx + mathSign * kc * q ** 2 * (x - xo) / d ** 3
            fy = fy + mathSign * kc * q ** 2 * (y - yo) / d ** 3
          }
        }
      });

      wallForce = false;

      if (y + radius - yw > 0.02 * radius) {
        fy = fy - kw * (y + radius - yw) - kv * v ;
        wallForce = true;
      }
      if (y - radius - yw0 < -0.02 * radius) {
        fy = fy + kw * (radius + yw0 - y) - kv * v ;
        wallForce = true;
      }

      if (x + radius - xw > 0.02 * radius) {
        fx = fx - kw * (x + radius - xw) - kv * u ;
        wallForce = true;
      }
      if (x - radius - xw0 < -0.02 * radius) {
        fx = fx + kw * (radius + xw0 - x) - kv * u ;
        wallForce = true;
      }

      circle.fx = fx;
      circle.fy = fy;
      u0 = u;
      v0 = v;
      if (circle.count == 1) {
        fx0 = fx;
        fy0 = fy;
      }

      u = u + (fx0 + fx)/2 / m * dt;
      v = v + (fy0 + fy)/2 / m * dt;

      x = x + (u0 + u) / 2 * dt;
      y = y + (v0 + v) / 2 * dt;

      if (y + radius > yw || y - radius < yw0) {
        if (!wallForce) {
          a = circle.newy + radius <= yw
          b = circle.newy - radius >= yw0
          if (a && b) {
            v = -ks * v;
          }
        }
      }

      if (x + radius > xw || x - radius < xw0) {
        if (!wallForce) {
          a = circle.newx + radius <= xw
          b = circle.newx - radius >= xw0
          if (a && b) {
            u = -ks * u;
          }
        }
      }

      circle.newu = u;
      circle.newv = v;
      circle.newy = y;
      circle.newx = x;
      if (circle == circles[circles.length - 1]) {
        circles.forEach(circleToUpdate => {
          circleToUpdate.style.top = circleToUpdate.newy + 'px';
          circleToUpdate.style.left = circleToUpdate.newx + 'px';
          circleToUpdate.oldx = circleToUpdate.newx;
          circleToUpdate.oldy = circleToUpdate.newy;
          circleToUpdate.oldu = circleToUpdate.newu;
          circleToUpdate.oldv = circleToUpdate.newv;
        });
      }
    }
  });
}

function main() {
  document.addEventListener("mousedown", createcircle);
  document.getElementById("dropButton").addEventListener("click", drop);
}
