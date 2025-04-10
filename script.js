// Game constants
const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

// Train colors array
const TRAIN_COLORS = [
  "#204852", // Blue Dianne (default)
  "#eb2632", // Red
  "#ff9a3c", // Orange
  "#876464", // Brown
  "#17b794", // Green
  "#0092ca", // Blue
  "#8971d0", // Indigo (Purple)
  "#ff5d9e", // Violet (Pink)
  "#303841", // Black Grey
  "#fac70b", // Yellow
];

// Game variables
let canvas, ctx;
let train = [];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let gameLoop;
let gameStarted = false;
let gameOver = false;
let medalsContainer;

// Initialize game
function init() {
  console.log("Initializing game...");
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  medalsContainer = document.getElementById("medals");

  // Set canvas size
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  // Initialize train
  train = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];

  // Initialize food
  generateFood();

  // Initialize medals
  initializeMedals();

  // Add event listeners
  document.addEventListener("keydown", handleKeyPress);
  document
    .getElementById("startButton")
    .addEventListener("click", startNewGame);
  console.log("Game initialized successfully");
}

// Initialize medals
function initializeMedals() {
  medalsContainer.innerHTML = "";
  for (let i = 0; i < TRAIN_COLORS.length; i++) {
    const medal = document.createElement("div");
    medal.className = "medal";
    medal.style.backgroundColor = TRAIN_COLORS[i];
    medalsContainer.appendChild(medal);
  }
}

// Update medals based on score
function updateMedals() {
  const currentColorIndex = Math.floor(score / 50);
  const medals = medalsContainer.children;

  for (let i = 0; i < medals.length; i++) {
    if (i <= currentColorIndex) {
      medals[i].classList.add("unlocked");
    } else {
      medals[i].classList.remove("unlocked");
    }
  }
}

// Generate food at random position
function generateFood() {
  food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };

  // Make sure food doesn't spawn on train
  for (let segment of train) {
    if (segment.x === food.x && segment.y === food.y) {
      generateFood();
      return;
    }
  }
}

// Handle keyboard input
function handleKeyPress(event) {
  console.log("Key pressed:", event.code);
  if (!gameStarted && event.code === "Space") {
    console.log("Starting game...");
    startGame();
    return;
  }

  if (gameOver) return;

  switch (event.key) {
    case "ArrowUp":
      if (direction.y !== 1) {
        direction = { x: 0, y: -1 };
      }
      break;
    case "ArrowDown":
      if (direction.y !== -1) {
        direction = { x: 0, y: 1 };
      }
      break;
    case "ArrowLeft":
      if (direction.x !== 1) {
        direction = { x: -1, y: 0 };
      }
      break;
    case "ArrowRight":
      if (direction.x !== -1) {
        direction = { x: 1, y: 0 };
      }
      break;
  }
}

// Start new game
function startNewGame() {
  console.log("Starting new game...");
  // Reset game state
  train = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  direction = { x: 0, y: 0 };
  score = 0;
  document.getElementById("score").textContent = score;
  gameOver = false;
  gameStarted = false;
  document.getElementById("startButton").classList.add("hidden");
  generateFood();
  updateMedals();
  console.log("New game state initialized");
}

// Start game
function startGame() {
  console.log("Starting game loop...");
  gameStarted = true;
  // Set initial direction to right when starting
  direction = { x: 1, y: 0 };
  gameLoop = setInterval(update, 150);
  console.log("Game loop started");
}

// Get current train color based on score
function getTrainColor() {
  const colorIndex = Math.floor(score / 50) % TRAIN_COLORS.length;
  return TRAIN_COLORS[colorIndex];
}

// Update game state
function update() {
  if (gameOver) return;

  // Move train
  const head = { x: train[0].x + direction.x, y: train[0].y + direction.y };

  // Check for collisions
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    gameOver = true;
    clearInterval(gameLoop);
    document.getElementById("startButton").classList.remove("hidden");
    return;
  }

  // Check for self-collision
  for (let segment of train) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver = true;
      clearInterval(gameLoop);
      document.getElementById("startButton").classList.remove("hidden");
      return;
    }
  }

  train.unshift(head);

  // Check for food collision
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById("score").textContent = score;
    updateMedals();
    generateFood();
  } else {
    train.pop();
  }

  draw();
}

// Draw game state
function draw() {
  // Clear canvas
  ctx.fillStyle = "#ecf0f1";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Draw train with current color
  ctx.fillStyle = getTrainColor();
  for (let segment of train) {
    ctx.fillRect(
      segment.x * CELL_SIZE,
      segment.y * CELL_SIZE,
      CELL_SIZE - 1,
      CELL_SIZE - 1
    );
  }

  // Draw food with next train color
  const currentColorIndex = Math.floor(score / 50) % TRAIN_COLORS.length;
  const nextColorIndex = (currentColorIndex + 1) % TRAIN_COLORS.length;
  ctx.fillStyle = TRAIN_COLORS[nextColorIndex];
  ctx.fillRect(
    food.x * CELL_SIZE,
    food.y * CELL_SIZE,
    CELL_SIZE - 1,
    CELL_SIZE - 1
  );
}

// Initialize game when page loads
window.onload = init;
