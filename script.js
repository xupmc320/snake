// --- Canvas Setup ---
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

// --- Game Settings ---
const tileSize = 20;
let score = 0;
let gameSpeed = 100; // 初始速度 (延遲100ms)
let gameOver = true; 
let snake = [];
let dx = 0;
let dy = 0;
let foodX;
let foodY;

// --- 初始化與開始遊戲 ---
function initializeGame() {
    snake = [ {x: 200, y: 200}, {x: 180, y: 200}, {x: 160, y: 200} ];
    dx = tileSize;
    dy = 0;
    score = 0;
    gameSpeed = 100; // 重置速度
    scoreDisplay.textContent = '分數: ' + score;
    createFood();
    gameOver = false;
    restartButton.classList.add('hidden');
    startButton.classList.add('hidden');
}

function startGame() {
    initializeGame();
    main(); // 啟動遊戲迴圈
}

// --- 遊戲主要函式 ---
function main() {
    // 遊戲迴圈的核心，使用 setTimeout 達成
    setTimeout(function onTick() {
        // *** BUG修復點 ***
        // 我們將檢查遊戲結束的邏輯移到這裡，確保每次移動後都檢查
        if (didGameEnd()) {
            // 如果 didGameEnd() 回傳 true，就執行遊戲結束的函式
            endGame();
            return; // 立刻停止遊戲迴圈
        }

        // 如果遊戲還沒結束，就正常執行
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();

        // 再次呼叫 main 函式，形成無限迴圈
        main();
    }, gameSpeed); // *** 使用 gameSpeed 變數來控制速度 ***
}

// --- 其他輔助函式 ---
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
        
        // *** 新增功能點：逐漸加速 ***
        // 每吃到一次食物，就讓延遲減少2毫秒，但最快不超過40毫秒延遲
        if (gameSpeed > 40) {
            gameSpeed -= 2;
        }

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

function endGame() {
    gameOver = true;
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
    if (gameOver && event.keyCode !== 32) return; // 遊戲結束時只允許空白鍵

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
    
    // 讓空白鍵也能觸發開始/重新開始
    if (keyPressed === SPACE_KEY && gameOver) {
        startGame();
    }
}