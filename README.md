
# 3D Color Dreidel Game

A fun and interactive 3D board game built using **JavaScript** and **Three.js**. The game involves spinning a dreidel to determine moves, where players aim to reach their respective goal rows first.

---

## Overview

The **3D Color Dreidel Game** is a two-player game where:
- Players start on a 5x5 grid with randomly colored tiles.
- A dreidel spin determines the color of the tile they can move to.
- Players take turns, navigating towards the other side of the board.
- The first player to reach the other side wins!

The game features:
- A visually engaging 3D board using **Three.js**.
- Dynamic player movements and interactions.
- Reset functionality to play multiple rounds.

---

## How It Works

### Game Logic
1. **Board Setup**:
   - The board is a 5x5 grid with tiles randomly assigned one of four colors: red, blue, green, yellow.
   - Players start at opposite sides of the board:
     - Player 1 begins at `[0, 2]` and aims to reach row 4.
     - Player 2 begins at `[4, 2]` and aims to reach row 0.

2. **Player Movement**:
   - Players spin the dreidel, which randomly selects a color.
   - Based on the spin result, the current player moves to an adjacent tile of the same color.
   - If no valid move exists, the turn passes to the other player.

3. **Winning Condition**:
   - A player wins by reaching their respective goal row.

### Frontend and 3D Rendering
- **Three.js** is used for rendering the 3D board and player tokens.
- The board tiles are represented as colored cubes.
- Players are represented as 3D spheres that move dynamically across the board.

---

## User Instructions

### How to Use
1. **Gameplay**:
   - The game starts with Player 1.
   - Click the **Spin Dreidel** button to spin and get a color.
   - Watch the player's token move to a valid adjacent tile of the spun color.
   - The game alternates between players until one reaches their goal row.

2. **Resetting**:
   - Click the **Reset Game** button to reset the board, tokens, and state for a new round.

### How to Run
1. **Install Requirements**:
   - Ensure you have a modern web browser (e.g., Chrome, Edge, Firefox) installed.

2. **Download the Project**:
   - Clone or download the repository:
     ```bash
     git clone <repository-url>
     ```
   - Navigate to the project folder.

3. **Run the Game**:
   - Open the `index.html` file in your browser to start the game.

4. **Optional: Use a Local Server**:
   - For a better experience, serve the project with a local server:
     ```bash
     npx http-server
     ```
   - Open the provided URL (e.g., `http://127.0.0.1:8080`) in your browser.

---

Enjoy playing the **3D Color Dreidel Game**! 😊
