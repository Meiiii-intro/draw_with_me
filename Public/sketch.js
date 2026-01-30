let socket;
let isDrawing = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  stroke(255);
  strokeWeight(4);

  socket = io();

  socket.on("drawing", (data) => {
    const p = denormalizeLine(data);
    if (data.w) strokeWeight(data.w);
    line(p.x1, p.y1, p.x2, p.y2);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function mousePressed() { isDrawing = true; }
function mouseReleased() { isDrawing = false; }

function mouseDragged() {
  if (!isDrawing) return;
  drawAndSend(pmouseX, pmouseY, mouseX, mouseY);
  return false;
}

function touchStarted() { isDrawing = true; return false; }
function touchEnded() { isDrawing = false; return false; }

function touchMoved() {
  if (!isDrawing) return false;
  drawAndSend(pmouseX, pmouseY, mouseX, mouseY);
  return false;
}

function drawAndSend(x1, y1, x2, y2) {
  const d = dist(x1, y1, x2, y2);
  const w = map(d, 0, 25, 8, 2, true);
  strokeWeight(w);
  line(x1, y1, x2, y2);

  const data = normalizeLine(x1, y1, x2, y2, w);
  socket.emit("drawing", data);
}

function normalizeLine(x1, y1, x2, y2, w) {
  return {
    x1: x1 / width,
    y1: y1 / height,
    x2: x2 / width,
    y2: y2 / height,
    w
  };
}

function denormalizeLine(data) {
  return {
    x1: data.x1 * width,
    y1: data.y1 * height,
    x2: data.x2 * width,
    y2: data.y2 * height
  };
}