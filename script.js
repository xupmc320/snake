// --- Canvas Setup ---
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');


// --- Game Settings ---
const tileSize = 20;
let score = 0;
let gameInterval; // 用來儲存 setInterval 的 ID
let gameSpeed = 100;
let gameOver = true; // 遊戲一開始設為結束狀態
let snake = [];
let dx = 0;
let dy = 0;
let foodX;
let foodY;


// --- 初始化遊戲 ---
function initializeGame() {
    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];
    dx = tileSize;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = '分數: 0';
    createFood();
    gameOver = false;
    restartButton.classList.add('hidden');
}


// --- 遊戲主要函式 ---
function main() {
    if (gameOver) return;


    setTimeout(function onTick() {
        if (!gameOver) {
            clearCanvas();
            drawFood();
            moveSnake();
            drawSnake();
            main();
        }
    }, gameSpeed);
}


// --- 輔助函式 (與之前基本相同，但會檢查遊戲是否結束) ---
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
    const head = { x: snake.at(0).x + dx, y: snake.at(0).y + dy };
    snake.unshift(head);


    const didEatFood = snake.at(0).x === foodX && snake.at(0).y === foodY;
    if (didEatFood) {
        score += 10;
        scoreDisplay.textContent = '分數: ' + score;
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
        if (snake.at(i).x === snake.at(0).x && snake.at(i).y === snake.at(0).y) return true;
    }


    const hitLeftWall = snake.at(0).x < 0;
    const hitRightWall = snake.at(0).x >= gameCanvas.width;
    const hitTopWall = snake.at(0).y < 0;
    const hitBottomWall = snake.at(0).y >= gameCanvas.height;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}


function endGame() {
    gameOver = true;
    startButton.classList.remove('hidden');
    restartButton.classList.remove('hidden');
    ctx.fillStyle = 'white';
    ctx.font = '50px Verdana';
    ctx.fillText('Game Over!', gameCanvas.width / 6.5, gameCanvas.height / 2);
}


// --- 事件監聽 ---
document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);


function changeDirection(event) {
    if (gameOver) return;


    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const SPACE_KEY = 32;


    const keyPressed = event.keyCode;
    const goingUp = dy === -tileSize;
    const goingDown = dy === tileSize;
    const goingRight = dx === tileSize;
    const goingLeft = dx === -tileSize;


    if (keyPressed === LEFT_KEY && !goingRight) { dx = -tileSize; dy = 0; }
    if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -tileSize; }
    if (keyPressed === RIGHT_KEY && !goingLeft) { dx = tileSize; dy = 0; }
    if (keyPressed === DOWN_KEY && !goingUp) { dx = 0; dy = tileSize; }
    if ((keyPressed === SPACE_KEY || event.type === 'click') && gameOver) {
        startGame();
    }
}


function startGame() {
    initializeGame();
    gameOver = false;
    startButton.classList.add('hidden');
    restartButton.classList.add('hidden');
    main();
}


// 遊戲一載入就初始化
initializeGame();