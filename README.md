# 3D Color Dreidel Game

![dreidle](https://github.com/user-attachments/assets/95cacbb4-4290-4750-ae1c-6e130e302f38)


## Overview

This is a unique, interactive 3D board game implemented using Three.js, where players navigate a color-based board by spinning a dreidel. The game combines elements of chance and strategy in a visually engaging 3D environment.

## Features

- 3D rendered game board with randomly colored squares
- Interactive dreidel spinning mechanism
- Two-player turn-based gameplay
- Orbit controls for exploring the 3D scene
- Responsive design
- Winner overlay with game reset option

## Technologies Used

- Three.js for 3D rendering
- OrbitControls for camera navigation
- Vanilla JavaScript for game logic
- Express.js for serving the application

## Game Rules

- The game is played on a 5x5 board with randomly colored squares
- Players take turns spinning the dreidel
- The spin result determines the color of possible moves
- Players can move to an adjacent square matching the dreidel's color
- The goal is to reach the opposite side of the board
- First player to reach their goal row wins

## Setup and Installation

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation Steps

1. Clone the repository
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies
   ```bash
   npm install express
   ```

3. Start the server
   ```bash
   node server.js
   ```

4. Open `http://localhost:3000` in your web browser

## Project Structure

- `index.html`: Main HTML file
- `app.js`: Game logic and Three.js rendering
- `server.js`: Express server configuration
- `style.css`: Styling for the application

## Controls

- Click "Spin Dreidel" to take your turn
- Use mouse to orbit and zoom the 3D scene
- Click "Reset Game" to start a new game

Enjoy 😊
