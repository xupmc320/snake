// --- 取得 HTML 元素 ---
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// --- 音效檔案 ---
const eatSound = new Audio('sounds/eat.mp3');
const gameOverSound = new Audio('sounds/gameOver.mp3');

// --- 遊戲設定與狀態變數 ---
const tileSize = 20;
const gameSpeed = 6;
let frameCounter = 0;
let score, gameState, snake, dx, dy, foodX, foodY, cheatCodeBuffer, isWrapMode;

// --- 核心函式區 ---

function prepareNewGame() {
    score = 0;
    scoreDisplay.textContent = '分數: 0';
    if (isWrapMode) {
        scoreDisplay.style.color = '#2ecc71';
        scoreDisplay.textContent = '穿牆模式已啟用！';
    } else {
        scoreDisplay.style.color = '';
    }
    snake = [ {x: 200, y: 200}, {x: 180, y: 200}, {x: 160, y: 200} ];
    dx = tileSize;
    dy = 0;
    createFood();
}

function startGame() {
    prepareNewGame();
    gameState = 'playing';
}

function backToStartScreen() {
    gameState = 'startScreen';
    cheatCodeBuffer = '';
    isWrapMode = false;
    scoreDisplay.style.color = '';
    scoreDisplay.textContent = '分數: 0';
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    frameCounter++;
    if (frameCounter % gameSpeed !== 0) {
        return;
    }

    if (gameState === 'playing') {
        moveSnake();
        if (didGameEnd()) {
            gameState = 'gameOver';
            gameOverSound.play();
        }
    }

    clearCanvas();
    if (gameState === 'startScreen') {
        drawStartScreen();
    } else if (gameState === 'playing') {
        drawFood();
        drawSnake();
    } else if (gameState === 'gameOver') {
        drawFood();
        drawSnake();
        drawGameOverScreen();
    }
}

// ... (繪圖函式與遊戲邏輯函式維持不變) ...
function drawStartScreen() { ctx.fillStyle = 'white'; ctx.font = '30px Verdana'; ctx.textAlign = 'center'; ctx.fillText('請按 Enter 或點擊畫面開始', gameCanvas.width / 2, gameCanvas.height / 2); if (isWrapMode) { ctx.font = '20px Verdana'; ctx.fillStyle = '#2ecc71'; ctx.fillText('穿牆模式已啟用', gameCanvas.width / 2, gameCanvas.height / 2 + 40); } }
function drawGameOverScreen() { ctx.fillStyle = 'white'; ctx.font = '50px Verdana'; ctx.textAlign = 'center'; ctx.fillText('Game Over!', gameCanvas.width / 2, gameCanvas.height / 2); ctx.font = '20px Verdana'; ctx.fillText('請按 Enter 或點擊畫面重新開始', gameCanvas.width / 2, gameCanvas.height / 2 + 40); }
function moveSnake() { let head = {x: snake[0].x + dx, y: snake[0].y + dy}; if (isWrapMode) { if (head.x >= gameCanvas.width) head.x = 0; if (head.x < 0) head.x = gameCanvas.width - tileSize; if (head.y >= gameCanvas.height) head.y = 0; if (head.y < 0) head.y = gameCanvas.height - tileSize; } snake.unshift(head); const didEatFood = snake[0].x === foodX && snake[0].y === foodY; if (didEatFood) { score += 10; scoreDisplay.textContent = '分數: ' + score; eatSound.play(); createFood(); } else { snake.pop(); } }
function didGameEnd() { for (let i = 1; i < snake.length; i++) { if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true; } if (isWrapMode) return false; const hitLeftWall = snake[0].x < 0; const hitRightWall = snake[0].x >= gameCanvas.width; const hitTopWall = snake[0].y < 0; const hitBottomWall = snake[0].y >= gameCanvas.height; return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall; }
function clearCanvas() { ctx.fillStyle = 'black'; ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height); }
function drawFood() { ctx.fillStyle = 'red'; ctx.fillRect(foodX, foodY, tileSize, tileSize); }
function createFood() { foodX = Math.floor(Math.random() * (gameCanvas.width / tileSize)) * tileSize; foodY = Math.floor(Math.random() * (gameCanvas.height / tileSize)) * tileSize; }
function drawSnake() { snake.forEach(part => { ctx.fillStyle = 'lime'; ctx.fillRect(part.x, part.y, tileSize, tileSize); }); }


// --- 事件處理 ---

// *** 新增：滑鼠點擊事件處理函式 ***
function handleClick() {
    if (gameState === 'startScreen') {
        startGame();
    } else if (gameState === 'gameOver') {
        backToStartScreen();
    }
}

function handleKeyDown(event) {
    const keyPressed = event.key;
    
    if (gameState === 'startScreen') {
        if (keyPressed === 'Enter') {
            startGame();
            return;
        }
        cheatCodeBuffer += keyPressed.toLowerCase();
        if (cheatCodeBuffer.endsWith('gg')) {
            isWrapMode = true;
            drawStartScreen(); 
            cheatCodeBuffer = '';
        }
        if (cheatCodeBuffer.length > 10) {
            cheatCodeBuffer = cheatCodeBuffer.substring(cheatCodeBuffer.length - 10);
        }
    } else if (gameState === 'gameOver') {
        if (keyPressed === 'Enter') {
            backToStartScreen();
        }
    } else if (gameState === 'playing') {
        const goingUp = dy === -tileSize;
        const goingDown = dy === tileSize;
        const goingRight = dx === tileSize;
        const goingLeft = dx === -tileSize;
        const key = keyPressed.toLowerCase();

        if ((key === 'arrowleft' || key === 'a') && !goingRight) { dx = -tileSize; dy = 0; }
        else if ((key === 'arrowup' || key === 'w') && !goingDown) { dx = 0; dy = -tileSize; }
        else if ((key === 'arrowright' || key === 'd') && !goingLeft) { dx = tileSize; dy = 0; }
        else if ((key === 'arrowdown' || key === 's') && !goingUp) { dx = 0; dy = tileSize; }
    }
}


// --- 啟動程序 ---
document.addEventListener('keydown', handleKeyDown);
gameCanvas.addEventListener('click', handleClick); // *** 新增：為畫布加上點擊事件監聽 ***

backToStartScreen(); // 設定好初始狀態
gameLoop(); // 啟動永不停止的遊戲迴圈！