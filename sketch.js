// https://kylemcdonald.github.io/cv-examples/FaceTracking/
// https://gist.github.com/lmccart/2273a047874939ad8ad1
// http://yhsong.com/
// https://www.instagram.com/p/B6GKkarhh3v/

// https://kylemcdonald.github.io/cv-examples/
// https://github.com/kylemcdonald/AppropriatingNewTechnologies/wiki/Week-2
//reference:
// https://editor.p5js.org/kerryrodden/sketches/-KkpbDv6Z

let capture;
let capture1;
let tracker;
let w = 640,
  h = 480;
let positions;
let saveButton, generateButton;
let nav;
let c, pg1, pg2;
let pg3, pg4;
let pg0, pg01;
let noeye1, noeye2;
let generate = false;
let col;
let navX;
let buttonX;
let a, b;
let sNum = 0;
let num = 0;
let theta = 0.001;
let r = 100;
let r1 = 0;
let limit = 1;

function setup() {
  w = windowWidth;
  h = windowHeight;
  navX = w - 15;
  buttonX = w;
  capture = createCapture({
    audio: false,
    video: {
      width: w,
      height: h
    }
  });
  //add for iphone compatibility
  capture.elt.setAttribute('playsinline', '');

  c = createCanvas(w, h);
  background(0);

  capture.size(w, h);
  capture.hide();
  pixelDensity(1);
  frameRate(24);

  col = color(205, 5, 10);
  a = HALF_PI / 8;
  b = TWO_PI / 8;

  nav = createDiv();
  nav.style('background-color', 'rgb(205, 5, 10)');
  nav.style('opacity', '0.5');
  nav.style('width', '150px');
  nav.style('height', `${h}px`);
  nav.style('border-radius', '15px');

  saveButton = createButton('SAVE');
  saveButton.mousePressed(() => {
    sNum++;
    saveCanvas(c, `eyes${sNum}`, 'jpg');
  });
  generateButton = createButton('GENERATE');
  generateButton.mousePressed(() => {
    frameRate(24);
    generate = !generate;
    if (generate == true) {
      num = floor(random(1, 9));
      // console.log(num);
      if (num == 1) {
        a = HALF_PI / 8;
        b = TWO_PI / 8;
        pg1 = createGraphics(width, height);
        pg2 = createGraphics(width, height);
      } else if (num == 2) {
        a = QUARTER_PI / 10;
        b = PI / 10;
      } else if (num == 3) {
        frameRate(10);
        image(capture, 0, 0, w, h);
        filter(GRAY);
      } else if (num == 7) {
        pg0 = createGraphics(width, height);
        pg01 = createGraphics(width, height);
      } else if (num == 8) {
        // noeye1 = createGraphics(width, height);
        // noeye2 = createGraphics(width, height);
        theta = 0.001;
        r = 100;
        r1 = 0;
        limit = 1;
      }
    }
  });

  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);

  capture1 = createCapture(VIDEO, (ready) => {
    capture1.size(width, height);
  });
  capture1.hide();
}

function draw() {

  //track eyes
  positions = tracker.getCurrentPosition();
  // Eye points from clmtrackr:
  // https://www.auduno.com/clmtrackr/docs/reference.html
  if (positions.length > 0) {
    const eye1 = {
      outline: [23, 63, 24, 64, 25, 65, 26, 66].map(getPos),
      center: getPos(27),
      top: getPos(24),
      bottom: getPos(26)
    };
    const eye2 = {
      // outline: [28, 67, 29, 68, 30, 69, 31, 70].map(getPos),
      outline: [30, 68, 29, 67, 28, 70, 31, 69].map(getPos),
      center: getPos(32),
      top: getPos(29),
      bottom: getPos(31)
    };

    if (generate == true) {
      let offsetx = map(mouseX, 0, width - 135, -10, 175);
      switch (num) {
        case 1:
          generateEye(eye1, pg1);
          generateEye(eye2, pg2);
          background(255);
          push();
          for (let i = 0; i < 8; i++) {
            rotate(a);
            push();
            translate(w / 2, h / 2);
            rotate(b * i);
            image(pg1, -eye1.center.x, -eye1.center.y);
            pop();
          }
          pop();
          push();
          for (let i = 0; i < 8; i++) {
            rotate(-a);
            push();
            translate(w / 2, h / 2);
            rotate(-b * i);
            image(pg2, -eye2.center.x, -eye2.center.y);
            pop();
          }
          pop();
          if (a >= 0.05) {
            b += 0.01;
            a -= 0.001;
          }
          break;
        case 2:
          background(255);
          pg1 = anothergenerateEye(eye1);
          pg2 = anothergenerateEye(eye2);
          push();
          for (let i = 0; i < 10; i++) {
            rotate(a);
            push();
            translate(w / 2, h / 2);
            rotate(b * i);
            image(pg1, -eye1.center.x - offsetx, -eye1.center.y);
            pop();
          }
          pop();
          push();
          for (let i = 0; i < 10; i++) {
            rotate(-a);
            push();
            translate(w / 2, h / 2);
            rotate(-b * i);
            image(pg2, -eye2.center.x + offsetx, -eye2.center.y);
            pop();
          }
          pop();
          if (a >= 0.05) {
            b += 0.01;
            a -= 0.001;
            // console.log(a);
          }
          break;
        case 3:
          pg3 = copyEyes(eye1);
          pg4 = copyEyes(eye2);
          image(pg3, 0, 0);
          image(pg4, 0, 0);
          break;
        case 4:
          background(0, 15);
          drawEye(eye1);
          drawEye(eye2);
          break;
        case 5:
          background(0, 20);
          drawEye(eye1);
          drawEye(eye2);
          pg3 = copyEyes(eye1);
          pg4 = copyEyes(eye2);
          image(pg3, 0, 0);
          image(pg4, 0, 0);
          break;
        case 6:
          background(0);
          drawEyeBox(eye1);
          drawEyeBox(eye2);
          break;
        case 7:
          image(capture, 0, 0, w, h);
          filter(GRAY);
          traceEyeBox(eye1, pg0);
          traceEyeBox(eye2, pg01);
          image(pg0, 0, 0, w, h);
          image(pg01, 0, 0, w, h);
          break;
        case 8:
          background(255);
          noeye1 = identifyEye(eye1);
          noeye2 = identifyEye(eye2);
          // identifyEye(eye1, noeye1);
          // identifyEye(eye2, noeye2);
          push();
          translate(w / 2, h / 2);
          for (let i = 0; i < 6; i++) {
            rotate(TWO_PI / 5); // rotation for the group of letters, which affects the spacing between letters
            push();
            translate(r * sin(theta), r * cos(theta));
            // rotate(theta); // rotation for individual letter
            for (let j = -60; j <= 100; j += 20) {
              rotate(r1);
              image(noeye1, -eye1.center.x - offsetx, -eye1.center.y + j, w, h);
            }
            pop();
            r1 += theta;
            if (r1 > limit || r1 < -limit) {
              theta = -theta;
            }
          }
          pop();
          push();
          translate(w / 2, h / 2);
          for (let i = 0; i < 6; i++) {
            rotate(TWO_PI / 5); // rotation for the group of letters, which affects the spacing between letters
            push();
            translate(r * sin(theta), r * cos(theta));
            // rotate(theta); // rotation for individual letter
            for (let j = -60; j <= 100; j += 20) {
              rotate(r1);
              image(noeye2, -eye2.center.x + offsetx, -eye2.center.y + j, w, h);
            }
            pop();
            r1 += theta;
            if (r1 > limit || r1 < -limit) {
              theta = -theta;
            }
          }
          pop();
          // image(noeye1, 0, 0, w, h);
          // image(noeye2, 0, 0, w, h);
          filter(GRAY);
          break;
      }
    } else {
      image(capture, 0, 0, w, h);
      filter(GRAY);
    }
  } else {
    let filterpg = createGraphics(width, height);
    filterpg.background(205, 5, 10, 75);
    // tint(205, 5, 10, 100);
    image(capture, 0, 0, w, h);
    image(filterpg, 0, 0, w, h);
  }


  if (mouseX >= w - 135) {
    if (navX >= w - 135) {
      navX -= 5;
      buttonX -= 5;
    }
    nav.position(navX, 0);
    saveButton.position(buttonX, 300 - 35);
    generateButton.position(buttonX, 300);
  } else {
    if (navX <= w - 15) {
      navX += 5;
      buttonX += 5;
    }
    nav.position(navX, 0);
    saveButton.position(buttonX, 300 - 35);
    generateButton.position(buttonX, 300);
  }
}

function getPos(index) {
  return createVector(positions[index][0], positions[index][1]);
}

function drawEyeBox(eye) {
  let irisR = min(eye.center.dist(eye.top), eye.center.dist(eye.bottom));
  let irisSize = irisR * 2;
  // console.log(eye.center.x);
  // let rectX = eye.outline[0];
  let rectW = eye.outline[0].dist(eye.outline[4]);
  // console.log(rectX);
  strokeWeight(1);
  noFill();
  stroke(col);
  rect(eye.outline[0].x - irisR * 2, eye.outline[0].y - irisR * 2, rectW * 1.5, irisR * 4);
}

function traceEyeBox(eye, pg) {
  let irisR = min(eye.center.dist(eye.top), eye.center.dist(eye.bottom));
  let irisSize = irisR * 2;
  // console.log(eye.center.x);
  // let rectX = eye.outline[0];
  let rectW = eye.outline[0].dist(eye.outline[4]);
  // console.log(rectX);
  pg.strokeWeight(1);
  pg.noFill();
  pg.stroke(col);
  pg.rect(eye.outline[0].x - irisR * 2, eye.outline[0].y - irisR * 2, rectW * 1.5, irisR * 4);
  return pg;
}

function drawEye(eye) {
  noFill();
  stroke(col);
  strokeWeight(3);
  drawOutline(eye);
  let irisR = min(eye.center.dist(eye.top), eye.center.dist(eye.bottom));
  let irisSize = irisR * 2;

  noStroke();
  fill(col);
  ellipse(eye.center.x, eye.center.y, irisSize, irisSize);
  let pupilSize = irisR;
  fill(255);
  ellipse(eye.center.x, eye.center.y, pupilSize, pupilSize);
}

function drawOutline(eye) {
  beginShape();
  let firstPos = eye.outline[0];
  // https: //developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  eye.outline.forEach((pos, index) => {
    // https://p5js.org/reference/#/p5/curveVertex
    curveVertex(pos.x, pos.y);
    if (index === 0) {
      curveVertex(firstPos.x, firstPos.y);
    }
    if (index === eye.outline.length - 1) {
      curveVertex(firstPos.x, firstPos.y);
      curveVertex(firstPos.x, firstPos.y);
    }
  });
  endShape();
}

function generateEye(eye, pg) {
  pg.fill(0);
  pg.strokeWeight(3);
  pg.beginShape();
  let firstPos = eye.outline[0];
  eye.outline.forEach((pos, index) => {
    pg.curveVertex(pos.x, pos.y);
    if (index === 0) {
      pg.curveVertex(firstPos.x, firstPos.y);
    }
    if (index === eye.outline.length - 1) {
      pg.curveVertex(firstPos.x, firstPos.y);
      pg.curveVertex(firstPos.x, firstPos.y);
    }
  });
  pg.endShape();
  let irisR = min(eye.center.dist(eye.top), eye.center.dist(eye.bottom));
  let irisSize = irisR * 2;
  pg.noStroke();
  pg.fill(col);
  pg.ellipse(eye.center.x, eye.center.y, irisSize, irisSize);
  let pupilSize = irisR;
  pg.fill(255);
  pg.ellipse(eye.center.x, eye.center.y, pupilSize, pupilSize);
  return pg;
}

function anothergenerateEye(eye) {
  let pg = createGraphics(width, height);
  pg.fill(0);
  pg.strokeWeight(3);
  pg.beginShape();
  let firstPos = eye.outline[0];
  eye.outline.forEach((pos, index) => {
    pg.curveVertex(pos.x, pos.y);
    if (index === 0) {
      pg.curveVertex(firstPos.x, firstPos.y);
    }
    if (index === eye.outline.length - 1) {
      pg.curveVertex(firstPos.x, firstPos.y);
      pg.curveVertex(firstPos.x, firstPos.y);
    }
  });
  pg.endShape();
  let irisR = min(eye.center.dist(eye.top), eye.center.dist(eye.bottom));
  let irisSize = irisR * 2;
  pg.noStroke();
  pg.fill(col);
  pg.ellipse(eye.center.x, eye.center.y, irisSize, irisSize);
  let pupilSize = irisR;
  pg.fill(255);
  pg.ellipse(eye.center.x, eye.center.y, pupilSize, pupilSize);
  return pg;
}

function copyEyes(eye) {
  let pg = createGraphics(width, height);
  let irisR = min(eye.center.dist(eye.top), eye.center.dist(eye.bottom));
  let irisSize = irisR * 2;
  let rectW = eye.outline[0].dist(eye.outline[4]);

  let x1 = eye.outline[0].x - irisR * 2;
  let y1 = eye.outline[0].y - irisR * 2;
  // let x2 = round(x1 + random(-25, 25));
  // let y2 = round(y1 + random(-25, 25));
  let x2 = round(random(w / 7, 6 * w / 7));
  let y2 = round(random(h / 7, 6 * h / 7));
  pg.set(x2, y2, get(x1, y1, rectW * 1.5, irisR * 4));
  pg.updatePixels();
  return pg;
}

function identifyEye(eye) {
  noeye = createGraphics(w, h);
  noeye.pixelDensity(1);
  let a1x = eye.outline[0].x;
  let a2x = eye.outline[4].x;
  let b1y = eye.outline[2].y;
  let b2y = eye.outline[6].y;
  let dmax = dist(a1x, eye.outline[0].y, a2x, eye.outline[4].y) / 2;
  capture1.loadPixels();
  noeye.loadPixels();
  for (let x = floor(a1x); x < floor(a2x); x++) {
    for (let y = floor(b1y - b1y * 0.25); y < floor(b2y + b2y * 0.25); y++) {
      let d = dist(x, y, eye.center.x, eye.center.y);
      if (d <= dmax) {
        let index = (x + y * width) * 4;
        noeye.pixels[index + 0] = capture1.pixels[index + 0];
        noeye.pixels[index + 1] = capture1.pixels[index + 1];
        noeye.pixels[index + 2] = capture1.pixels[index + 2];
        noeye.pixels[index + 3] = 255;
      }
    }
  }
  noeye.updatePixels();
  return noeye;
}

function windowResized() {
  w = windowWidth;
  h = windowHeight;
  navX = w - 15;
  buttonX = w;
  nav.style('height', `${h}px`);
  resizeCanvas(w, h);
  background(0);
}

function keyPressed(event) {
  frameRate(24);
  if (event.key === 's') {
    sNum++;
    saveCanvas(c, `eyes${sNum}`, 'jpg');
  } else if (event.key == 1) {
    generate = true;
    num = 1;
    a = HALF_PI / 8;
    b = TWO_PI / 8;
    pg1 = createGraphics(width, height);
    pg2 = createGraphics(width, height);
  } else if (event.key == 2) {
    generate = true;
    num = 2;
    a = QUARTER_PI / 10;
    b = PI / 10;
  } else if (event.key == 3) {
    image(capture, 0, 0, w, h);
    filter(GRAY);
    frameRate(10);
    generate = true;
    num = 3;
  } else if (event.key == 4) {
    generate = true;
    num = 4;
  } else if (event.key == 5) {
    generate = true;
    num = 5;
  } else if (event.key == 6) {
    generate = true;
    num = 6;
  } else if (event.key == 7) {
    pg0 = createGraphics(width, height);
    pg01 = createGraphics(width, height);
    generate = true;
    num = 7;
  } else if (event.key == 8) {
    // noeye1 = createGraphics(width, height);
    // noeye2 = createGraphics(width, height);
    theta = 0.001;
    r = 100;
    r1 = 0;
    limit = 1;
    generate = true;
    num = 8;
  } else {
    generate = false;
  }
}