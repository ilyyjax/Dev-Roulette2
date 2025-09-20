const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const timerEl = document.getElementById("timer");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");

let options = Array(9).fill("Buy").concat("Sell");
let angle = 0;
let spinning = false;

// Draw the wheel
function drawWheel() {
  let arc = (2 * Math.PI) / options.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < options.length; i++) {
    let startAngle = angle + i * arc;
    let endAngle = startAngle + arc;

    // Alternate colors
    ctx.fillStyle = i % 2 === 0 ? "#4caf50" : "#81c784";
    if (options[i] === "Sell") ctx.fillStyle = "#e53935";

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2 - 5,
      startAngle,
      endAngle
    );
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Text
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(startAngle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.fillText(options[i], canvas.width / 2 - 30, 10);
    ctx.restore();
  }

  // Pointer (triangle at top)
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 20, 10);
  ctx.lineTo(canvas.width / 2 + 20, 10);
  ctx.lineTo(canvas.width / 2, 50);
  ctx.closePath();
  ctx.fill();
}

// Spin logic with smooth acceleration/deceleration
function spinWheel() {
  if (spinning) return;
  spinning = true;

  let duration = 10000; // 10 seconds
  let start = performance.now();
  let totalRotations = Math.random() * 4 + 5; // random spins
  let targetAngle = angle + totalRotations * 2 * Math.PI;

  function animate(time) {
    let elapsed = time - start;
    let progress = Math.min(elapsed / duration, 1);

    // Ease in-out
    let eased =
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

    angle = angle + (targetAngle - angle) * eased;

    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      checkResult();
    }
  }

  requestAnimationFrame(animate);
}

// Check result under pointer
function checkResult() {
  angle = (angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  let arc = (2 * Math.PI) / options.length;
  let pointerAngle = (3 * Math.PI / 2 - angle + 2 * Math.PI) % (2 * Math.PI);
  let index = Math.floor(pointerAngle / arc);
  let result = options[index];

  if (result === "Sell") {
    message.style.display = "block";
    message.textContent = "YOU LOOOSE";
    overlay.style.display = "block";
    overlay.style.background = "black";
  } else {
    // Remove one BUY
    let idx = options.indexOf("Buy");
    if (idx !== -1) options.splice(idx, 1);
    if (options.length > 1) {
      startCountdown();
    }
  }
}

// Countdown with dim effect
function startCountdown() {
  let count = 3;
  timerEl.style.display = "block";
  overlay.style.display = "block";

  timerEl.textContent = count;
  let interval = setInterval(() => {
    count--;
    if (count > 0) {
      timerEl.textContent = count;
    } else {
      clearInterval(interval);
      timerEl.style.display = "none";
      overlay.style.display = "none";
      spinWheel();
    }
  }, 1000);
}

// Start game
drawWheel();
startCountdown();
