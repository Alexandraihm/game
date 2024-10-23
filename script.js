// Select the canvas and set its dimensions (Slightly reduced size)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1000;  // Reduced width
canvas.height = 700;  // Reduced height

// Player objects
const player1 = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    color: 'red',
    direction: 0,
    keys: { up: 'w', down: 'e' },
    trail: [],
    gapChance: 0
};

const player2 = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    color: 'blue',
    direction: 0,
    keys: { up: 'l', down: 'ö' },
    trail: [],
    gapChance: 0
};

// Game settings
const speed = 1.5;  // Reduced speed to slow down the lines
const lineWidth = 5;
const gapFrequency = 30; // Gaps will now appear more frequently (lower number = more gaps)

// Button to restart the game
const playAgainBtn = document.getElementById('playAgainBtn');

// Listen for keyboard inputs
let keysPressed = {};
let gameStarted = false;  // Game start flag

window.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;

    // Start the game when space is pressed
    if (!gameStarted && e.key === ' ') {
        startGame();
    }
});
window.addEventListener('keyup', (e) => { delete keysPressed[e.key]; });

// Main game loop
function gameLoop() {
    if (!gameStarted) return; // Ensure the game only runs when started

    movePlayer(player1);
    movePlayer(player2);

    drawPlayer(player1);
    drawPlayer(player2);

    // Check for collisions with other player's line and walls
    if (checkCollision(player1, player2) || checkWallCollision(player1) || checkWallCollision(player2)) {
        endGame(checkCollision(player1, player2) ? 'Player 1' : 'Player 2');
    } else {
        requestAnimationFrame(gameLoop);
    }
}

// Move player based on their direction and key inputs
function movePlayer(player) {
    // Control player direction
    if (keysPressed[player.keys.up]) player.direction -= 0.05; // Rotate left
    if (keysPressed[player.keys.down]) player.direction += 0.05; // Rotate right

    // Move player forward
    player.x += Math.cos(player.direction) * speed;
    player.y += Math.sin(player.direction) * speed;

    // Add the current position to the player's trail
    if (player.gapChance === 0 || Math.random() > 0.10) {  // Adjust gap frequency
        player.trail.push({ x: player.x, y: player.y });
    }

    // Manage random gaps in the line
    player.gapChance = (player.gapChance + 1) % gapFrequency;
}

// Draw the player's trail
function drawPlayer(player) {
    ctx.strokeStyle = player.color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    for (let i = 1; i < player.trail.length; i++) {
        const prev = player.trail[i - 1];
        const curr = player.trail[i];
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
    }
    ctx.stroke();
}

// Check for collisions between players' trails
function checkCollision(player1, player2) {
    // Check if player1 collides with player2's trail
    for (let i = 0; i < player2.trail.length; i++) {
        const trailPart = player2.trail[i];
        const dist = Math.hypot(player1.x - trailPart.x, player1.y - trailPart.y);
        if (dist < lineWidth) {
            return true; // Player 1 collided with Player 2's trail
        }
    }
    
    // Check if player2 collides with player1's trail
    for (let i = 0; i < player1.trail.length; i++) {
        const trailPart = player1.trail[i];
        const dist = Math.hypot(player2.x - trailPart.x, player2.y - trailPart.y);
        if (dist < lineWidth) {
            return true; // Player 2 collided with Player 1's trail
        }
    }

    return false; // No collisions detected
}

// Check if a player collides with the wall
function checkWallCollision(player) {
    return player.x < 0 || player.x > canvas.width || player.y < 0 || player.y > canvas.height;
}

// End the game and show the Play Again button
function endGame(winner) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.fillText(`${winner} wins!`, canvas.width / 2 - 100, canvas.height / 2);

    // Show the Play Again button
    playAgainBtn.style.display = 'block';
    playAgainBtn.addEventListener('click', restartGame);
}

// Restart the game by resetting the players and hiding the button
function restartGame() {
    // Reset player positions and trails
    player1.x = Math.random() * canvas.width;
    player1.y = Math.random() * canvas.height;
    player1.trail = [];
    player1.direction = 0;

    player2.x = Math.random() * canvas.width;
    player2.y = Math.random() * canvas.height;
    player2.trail = [];
    player2.direction = 0;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Hide the Play Again button
    playAgainBtn.style.display = 'none';

    // Reset game start flag and show start message again
    gameStarted = false;
    document.getElementById('startMessage').style.display = 'block';  // Show start message again
}

// Function to start the game
function startGame() {
    gameStarted = true;
    document.getElementById('startMessage').style.display = 'none';  // Hide the start message
    gameLoop();  // Start the game loop
}

// Show the start message when the page loads
document.getElementById('startMessage').style.display = 'block';
