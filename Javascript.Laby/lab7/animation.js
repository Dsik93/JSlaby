let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let balls = [];
let animationId;

// Start
function start() {
  let numBalls = parseInt(document.getElementById("numBalls").value);
  let distanceY = parseInt(document.getElementById("distanceY").value);
  initBalls(numBalls, distanceY);
  animate();
}

// Reset
function reset() {
  cancelAnimationFrame(animationId);
  balls = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Funkcja inicjalizująca kulki
function initBalls(numBalls, distanceY) {
  balls = [];
  for (let i = 0; i < numBalls; i++) {
    let ball = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      radius: 5
    };
    balls.push(ball);
  }
  balls.distanceY = distanceY; // minimalna odleglosc
}

// Funkcja rysująca
function drawBalls() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let ball of balls) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
  }
}

// Funkcja rysująca linie
function drawLines() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      let dx = balls[i].x - balls[j].x;
      let dy = balls[i].y - balls[j].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < balls.distanceY) {
        ctx.beginPath();
        ctx.moveTo(balls[i].x, balls[i].y);
        ctx.lineTo(balls[j].x, balls[j].y);
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

// Funkcja aktualizująca pozycję kulek
function updateBalls() {
  for (let ball of balls) {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Odbijanie od krawędzi
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.vx *= -1;
    }
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
      ball.vy *= -1;
    }
  }
}

// Funkcja animująca kulki i linie
function animate() {
  drawBalls();
  drawLines();
  updateBalls();
  animationId = requestAnimationFrame(animate);
}
