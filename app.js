import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js";

console.log('App.js loaded');

const COLORS = ["red", "blue", "green", "yellow"];
const BOARD_SIZE = 5;

// Game State
let board = [];
let players = [
  { position: [0, 2], goalRow: 4, color: "white" },
  { position: [4, 2], goalRow: 0, color: "black" }
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

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 3;
controls.maxDistance = 10;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Board Setup
const boardGroup = new THREE.Group();
scene.add(boardGroup);

// Dreidel Creation
function createDreidel() {
  const dreidel = new THREE.Group();
  
  // Body (4-sided pyramid)
  const bodyGeometry = new THREE.ConeGeometry(0.5, 1, 4);
  const bodyMaterials = COLORS.map(color => 
    new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0.8 })
  );
  const bodyMesh = new THREE.Mesh(bodyGeometry, new THREE.MeshFaceMaterial(bodyMaterials));
  bodyMesh.rotation.y = Math.PI / 4; // Rotate to show different sides
  dreidel.add(bodyMesh);
  
  // Handle
  const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3);
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.rotation.x = Math.PI / 2;
  handleMesh.position.y = -0.65;
  dreidel.add(handleMesh);
  
  return dreidel;
}

// Player Tokens
const playerMeshes = [];
function createPlayer(color, x, y) {
  const playerDreidel = createDreidel();
  playerDreidel.position.set(x - 2, 0.4, y - 2);
  scene.add(playerDreidel);
  playerMeshes.push(playerDreidel);
}

// Winning Overlay
function showWinningOverlay(winnerNumber) {
  // Remove any existing overlay
  const existingOverlay = document.getElementById('winning-overlay');
  if (existingOverlay) {
    document.body.removeChild(existingOverlay);
  }

  // Create full-screen overlay
  const overlay = document.createElement('div');
  overlay.id = 'winning-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';
  
  const message = document.createElement('div');
  message.innerHTML = `<h1 style="color: white; font-size: 5rem; text-align: center;">Player ${winnerNumber} Wins!</h1>`;
  
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Play Again';
  closeButton.style.marginTop = '20px';
  closeButton.style.padding = '10px 20px';
  closeButton.style.fontSize = '1.5rem';
  closeButton.onclick = () => {
    document.body.removeChild(overlay);
    resetGame();
  };
  
  const messageContainer = document.createElement('div');
  messageContainer.style.textAlign = 'center';
  messageContainer.appendChild(message);
  messageContainer.appendChild(closeButton);
  
  overlay.appendChild(messageContainer);
  document.body.appendChild(overlay);
}

// Spin Dreidel with Realistic Spinning Animation
function spinDreidel() {
  if (winner) return;

  const currentDreidel = playerMeshes[currentPlayer];
  const spinDuration = 2; // seconds
  const startTime = performance.now();
  
  // Spinning Physics
  const spinAxis = new THREE.Vector3(0, 1, 0);
  const spinSpeed = Math.PI * 4; // Multiple full rotations
  
  function animateSpin(currentTime) {
    const elapsedTime = (currentTime - startTime) / 1000;
    
    if (elapsedTime < spinDuration) {
      // Exponential decay of spin speed
      const currentSpinSpeed = spinSpeed * Math.exp(-elapsedTime);
      currentDreidel.rotation.y += currentSpinSpeed * (spinDuration - elapsedTime);
      
      requestAnimationFrame(animateSpin);
    } else {
      // Stop spinning and select color
      spinResult = COLORS[Math.floor(Math.random() * COLORS.length)];
      document.getElementById("spin-result").innerText = `Spin Result: ${spinResult}`;
      
      // Align dreidel to show selected color side
      currentDreidel.rotation.y = Math.PI / 4 + (Math.floor(Math.random() * 4) * Math.PI / 2);
      
      performPlayerMove(spinResult);
    }
  }
  
  requestAnimationFrame(animateSpin);
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
  console.log('Generated Board:', board);
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
      showWinningOverlay(winner);
    } else {
      currentPlayer = 1 - currentPlayer;
      document.getElementById("current-player").innerText = `Current Player: ${currentPlayer + 1}`;
    }
  } else {
    currentPlayer = 1 - currentPlayer;
    document.getElementById("current-player").innerText = `Current Player: ${currentPlayer + 1}`;
  }
}

// Reset Game
function resetGame() {
  winner = null;
  currentPlayer = 0;
  players = [
    { position: [0, 2], goalRow: 4, color: "white" },
    { position: [4, 2], goalRow: 0, color: "black" }
  ];
  playerMeshes.forEach((mesh, index) => {
    const [x, y] = players[index].position;
    mesh.position.set(x - 2, 0.4, y - 2);
    mesh.rotation.y = Math.PI / 4; // Reset rotation
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
  controls.update(); // Update orbit controls
  renderer.render(scene, camera);
}
animate();

// Responsive Handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
