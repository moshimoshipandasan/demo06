const canvas = document.getElementById("kaleidoscope");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawFractal(ctx, x, y, radius, depth) {
  if (depth === 0 || radius < 1) return;
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  
  if (Math.random() > 0.5) {
    const randomHue = Math.floor(Math.random() * 360);
    const lightness = 40 + Math.floor(Math.random() * 20);
    const alpha = 0.5 + Math.random() * 0.5;
    ctx.fillStyle = `hsla(${randomHue}, 100%, ${lightness}%, ${alpha})`;
    ctx.fill();
  } else {
    ctx.lineWidth = 1 + Math.random() * 3;
    const randomHue = Math.floor(Math.random() * 360);
    const lightness = 40 + Math.floor(Math.random() * 20);
    ctx.strokeStyle = `hsl(${randomHue}, 100%, ${lightness}%)`;
    ctx.stroke();
  }
  
  const newRadius = radius * (0.4 + Math.random() * 0.2);
  const branches = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < branches; i++) {
    const branchAngle = Math.random() * 2 * Math.PI;
    const distanceFactor = 0.5 + Math.random() * 0.5;
    const dx = Math.cos(branchAngle) * radius * distanceFactor;
    const dy = Math.sin(branchAngle) * radius * distanceFactor;
    drawFractal(ctx, x + dx, y + dy, newRadius, depth - 1);
  }
}

const numSegments = 12;
const angle = (2 * Math.PI) / numSegments;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  
  const offscreen = document.createElement("canvas");
  offscreen.width = canvas.width;
  offscreen.height = canvas.height;
  const offCtx = offscreen.getContext("2d");
  offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
  offCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
  offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
  
  const slowTime = Date.now() / 31457280000;
  const offsetX = Math.sin(slowTime) * 100;
  const offsetY = Math.cos(slowTime) * 100;
  const baseRadius = Math.min(cx, cy) * 0.2;
  
  drawFractal(offCtx, cx + offsetX, cy + offsetY, baseRadius, 5);
  
  for (let i = 0; i < numSegments; i++) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(i * angle);
    if (i % 2 === 0) {
      ctx.scale(1, -1);
    }
    ctx.drawImage(offscreen, -cx, -cy);
    ctx.restore();
  }
  
  requestAnimationFrame(draw);
}

draw();
