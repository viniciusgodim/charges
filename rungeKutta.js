var radius = 25;

function createCircle(event) {
  if (event.target.tagName === "HTML") {
    var newCircle = document.createElement('div');
    newCircle.className = 'circle';
    newCircle.style.position = 'absolute';
    newCircle.style.left = event.clientX + 'px';
    newCircle.style.top = event.clientY + 'px';
    newCircle.style.width = 2 * radius + 'px';
    newCircle.style.height = 2 * radius + 'px';
    newCircle.style.borderRadius = radius + 'px';
    newCircle.style.backgroundColor = '#' + Math.random().toString(16).substr(2, 6)
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


var dt = 0.01;
var kw = 0.9;
var kb = 5;
var m = 1;
var q = 1;
var kc = 500;
var kv = 0.35;
var g1 = 0.1;
var averageColor;

function getCoordinate(Circle,component){
  if(component == 0){
    return parseInt(Circle.style.left);
  } else{
    return parseInt(Circle.style.top);
  }
}

function getVelocity(Circle,component){
  if(component == 0){
    return Circle.u;
  } else{
    return Circle.v;
  }
}

function coloumbsLaw(Circle_,Circles_,Zextra_,component_){
  Q1 = getCoordinate(Circle_,component_) + Zextra_;
  f = 0;
  Circles_.forEach(OtherCircle_ => {
    if (Circle_ != OtherCircle_) {
      mathSign = Circle_.chargeSign * OtherCircle_.chargeSign;
      X1 = parseInt(Circle_.style.left);
      X2 = parseInt(OtherCircle_.style.left);
      Y1 = parseInt(Circle_.style.top);
      Y2 = parseInt(OtherCircle_.style.top);
      D = ((X2-X1)**2+(Y2-Y1)**2)**.5;
      Q2 = getCoordinate(OtherCircle_,component_);
      f = f + mathSign * (Q1 - Q2) / D ** 3
    }
  });
  F = f * kc * q ** 2 / m
  return F;
}

function rungeKutta(Circle,Circles,component){
  V = getVelocity(Circle,component);
  Z = getCoordinate(Circle,component);
  k1v = coloumbsLaw(Circle,Circles,0,component) * dt ;
  k1x = V*dt ;
  k2v = coloumbsLaw(Circle,Circles,k1x/2,component) * dt;
  k2x = (V + k1v/2)*dt ;
  k3v = coloumbsLaw(Circle,Circles,k2x/2,component) * dt;
  k3x = (V + k2v/2)*dt;
  k4v = coloumbsLaw(Circle,Circles,k3x,component) *dt;
  k4x = (V + k3v)*dt;
  Vnext = V + 1/6*(k1v + 2*k2v + 2*k3v + k4v);
  Znext = Z + 1/6 * (k1x + 2*k2x + 2*k3x + k4x);
  return [Znext,Vnext]
}

function drop() {
  dropButton = document.getElementById("dropButton");
  document.body.removeChild(dropButton);
  chargeSignForm = document.getElementById("chargeSignForm");
  document.body.removeChild(chargeSignForm);
  document.removeEventListener("mousedown", createCircle);
  circles = document.querySelectorAll('.circle')
  circles.forEach(circle =>{
    circle.u = 0;
    circle.v = 0;
  });
  circles.forEach(circle => {
    let call = setInterval(frame, dt);
    function frame() {
      yw = parseInt(window.innerHeight);
      xw = parseInt(window.innerWidth);
      rungeKuttaResultX = rungeKutta(circle,circles,0);
      rungeKuttaResultY = rungeKutta(circle,circles,1);
      circle.style.left = rungeKuttaResultX[0] + 'px';
      circle.u = rungeKuttaResultX[1];
      console.log(circle.u);
      circle.style.top = rungeKuttaResultY[0] + 'px';
      circle.v = rungeKuttaResultY[1];
    }
  });
}

function main() {
  document.addEventListener("mousedown", createCircle);
  document.getElementById("dropButton").addEventListener("click", drop);
}
