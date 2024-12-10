import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js";

console.log('App.js loaded');

const COLORS = ["red", "blue", "green", "yellow"];
const BOARD_SIZE = 5;

// Game State
let board = [];
let players = [
  { position: [0, 2], goalRow: 4, color: "white" },
  { position: [4, 2], goalRow: 0, color: "black" },
];
let currentPlayer = 0;
let spinResult = null;
let winner = null;

// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls for better interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Lights
const light = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Board Setup
const boardGroup = new THREE.Group();
scene.add(boardGroup);

// Player Tokens
const playerMeshes = [];
function createPlayer(color, x, y) {
  const geometry = new THREE.SphereGeometry(0.4, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x - 2, 0.4, y - 2);
  scene.add(mesh);
  playerMeshes.push(mesh);
}

// Generate the 3D Board
function generateBoard() {
  board = Array(BOARD_SIZE)
    .fill()
    .map(() =>
      Array(BOARD_SIZE)
        .fill()
        .map(() => COLORS[Math.floor(Math.random() * COLORS.length)])
    );

  boardGroup.clear();
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const geometry = new THREE.BoxGeometry(1, 0.2, 1);
      const material = new THREE.MeshStandardMaterial({ color: board[x][y] });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x - 2, 0, y - 2);
      boardGroup.add(cube);
    }
  }
  console.log('Generated Board:', board); // Debugging log
}

// Perform Player Move
function performPlayerMove(color) {
  const player = players[currentPlayer];
  const [x, y] = player.position;

  const possibleMoves = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ].filter(([nx, ny]) =>
    nx >= 0 &&
    nx < BOARD_SIZE &&
    ny >= 0 &&
    ny < BOARD_SIZE &&
    board[nx][ny] === color
  );

  if (possibleMoves.length > 0) {
    const [newX, newY] = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    player.position = [newX, newY];

    // Update Player Mesh Position
    playerMeshes[currentPlayer].position.set(newX - 2, 0.4, newY - 2);

    if (newX === player.goalRow) {
      winner = currentPlayer + 1;
      document.getElementById("spin-result").innerText = `Player ${winner} Wins!`;
    } else {
      currentPlayer = 1 - currentPlayer;
      document.getElementById("current-player").innerText = `Current Player: ${currentPlayer + 1}`;
    }
  } else {
    currentPlayer = 1 - currentPlayer;
    document.getElementById("current-player").innerText = `Current Player: ${currentPlayer + 1}`;
  }
}

// Spin Dreidel
function spinDreidel() {
  if (winner) return;

  spinResult = COLORS[Math.floor(Math.random() * COLORS.length)];
  document.getElementById("spin-result").innerText = `Spin Result: ${spinResult}`;
  performPlayerMove(spinResult);
}

// Reset Game Function
function resetGame() {
  winner = null;
  currentPlayer = 0;
  players = [
    { position: [0, 2], goalRow: 4, color: "white" },
    { position: [4, 2], goalRow: 0, color: "black" },
  ];
  playerMeshes.forEach((mesh, index) => {
    const [x, y] = players[index].position;
    mesh.position.set(x - 2, 0.4, y - 2);
    mesh.rotation.y = 0; // Reset rotation
  });
  generateBoard();
  document.getElementById("spin-result").innerText = "Spin Result: None";
  document.getElementById("current-player").innerText = "Current Player: 1";
}

// Initialize Game
generateBoard();
createPlayer("white", 0, 2);
createPlayer("black", 4, 2);
camera.position.set(0, 5, 5);
camera.lookAt(0, 0, 0);

// Event Listeners
document.getElementById("spin-dreidel").addEventListener("click", spinDreidel);
document.getElementById("reset-game").addEventListener("click", resetGame);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Required for damping
  renderer.render(scene, camera);
}
animate();
