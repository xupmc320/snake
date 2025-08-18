// --- script.js (v3.0 - 音效版) ---
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// *** 新增 Part 1：載入音效檔案 ***
const eatSound = new Audio('sounds/eat.mp3');
const gameOverSound = new Audio('sounds/gameOver.mp3');
// *** 新增結束 ***

const tileSize = 20;
let score = 0;
let gameOver = false;

let snake = [
  {x: 200, y: 200}, {x: 180, y: 200}, {x: 160, y: 200}
];
let dx = tileSize;
let dy = 0;
let foodX;
let foodY;

main();
createFood();

function main() {
    // *** 修改 Part 2：在遊戲結束時播放音效 ***
    if (didGameEnd()) {
        gameOverSound.play(); // <<-- 加上這一行
        gameOver = true;
    }
    // *** 修改結束 ***

    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '50px Verdana';
        ctx.fillText('Game Over!', gameCanvas.width / 6.5, gameCanvas.height / 2);
        return;
    }

    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        main();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX, foodY, tileSize, tileSize);
}

function createFood() {
    foodX = Math.floor(Math.random() * (gameCanvas.width / tileSize)) * tileSize;
    foodY = Math.floor(Math.random() * (gameCanvas.height / tileSize)) * tileSize;
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        scoreDisplay.textContent = '分數: ' + score;
        
        // *** 修改 Part 3：在吃到食物時播放音效 ***
        eatSound.play(); // <<-- 加上這一行
        // *** 修改結束 ***

        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach(snakePart => {
        ctx.fillStyle = 'lime';
        ctx.fillRect(snakePart.x, snakePart.y, tileSize, tileSize);
    });
}

function didGameEnd() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= gameCanvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= gameCanvas.height;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    // ... (此函式內容不變) ...
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const keyPressed = event.keyCode;
    const goingUp = dy === -tileSize;
    const goingDown = dy === tileSize;
    const goingRight = dx === tileSize;
    const goingLeft = dx === -tileSize;

    if (keyPressed === LEFT_KEY && !goingRight) { dx = -tileSize; dy = 0; }
    if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -tileSize; }
    if (keyPressed === RIGHT_KEY && !goingLeft) { dx = tileSize; dy = 0; }
    if (keyPressed === DOWN_KEY && !goingUp) { dx = 0; dy = tileSize; }
}