let ball = document.getElementById("ball");
let hole = document.getElementById("hole");
let container = document.getElementById("container");
let startButton = document.getElementById("startButton");
let startTime, endTime; // Czas start i koncu
let ballX, ballY; // Zmienne pliku
let tiltX = 0, tiltY = 0; // Zmienne wartosci
const speedFactor = 0.05;
const maxTilt = 10; 

//bazowe wartosci
const baseBeta = 90; 
const baseGamma = 0; 

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", handleOrientation, true); // Dodaj nasłuchiwanie na zmianę orientacji urządzenia
}

startButton.addEventListener("click", startGame);

function handleOrientation(event) {
  tiltX = Math.max(
    -maxTilt,
    Math.min((event.beta - baseBeta) * speedFactor, maxTilt)
  ); // Dostosuj beta do bazowej wartości i zastosuj współczynnik szybkości
  tiltY = Math.max(
    -maxTilt,
    Math.min((event.gamma - baseGamma) * speedFactor, maxTilt)
  );
}

//Kierunki
function updateBallPosition() {
  ballX += tiltY; 
  ballY += tiltX; 

  // Ogranicza pilke w kwadracie
  ballX = Math.max(
    0,
    Math.min(ballX, container.clientWidth - ball.clientWidth)
  );
  ballY = Math.max(
    0,
    Math.min(ballY, container.clientHeight - ball.clientHeight)
  );

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  checkCollision(); //
  requestAnimationFrame(updateBallPosition); // Zaktualizuj pozycje pilki
}

function checkCollision() {
  let holeRect = hole.getBoundingClientRect();
  let ballRect = ball.getBoundingClientRect();

  if (
    ballRect.left >= holeRect.left &&
    ballRect.right <= holeRect.right &&
    ballRect.top >= holeRect.top &&
    ballRect.bottom <= holeRect.bottom
  ) {
    endTime = new Date();
    let timeDiff = (endTime - startTime) / 1000;
    alert(`You win! Time: ${timeDiff.toFixed(2)} seconds`);
    recordTime(timeDiff);
    resetGame();
  }
}

function recordTime(time) {
  let records = JSON.parse(localStorage.getItem("records")) || []; // Pobierz
  records.push(time); // Dodaj
  localStorage.setItem("records", JSON.stringify(records)); // Zapisz
  displayRecords(); // Wyświetl
}

function displayRecords() {
  let records = JSON.parse(localStorage.getItem("records")) || []; // pobranie rekordu z local
  console.log("Records:", records); // Rekordy w konsoli
}

//Pilka na srodku
function resetGame() {
  ballX = container.clientWidth / 2 - ball.clientWidth / 2;
  ballY = container.clientHeight / 2 - ball.clientHeight / 2;
  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  //Losowa dziura
  let holeX = Math.random() * (container.clientWidth - hole.clientWidth); 
  let holeY = Math.random() * (container.clientHeight - hole.clientHeight);
  hole.style.left = `${holeX}px`;
  hole.style.top = `${holeY}px`;
}

function startGame() {
  resetGame();
  startTime = new Date();
  requestAnimationFrame(updateBallPosition);
}
