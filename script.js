// --- Canvas Setup ---
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

// --- Game Settings ---
const tileSize = 20;
let snakeX = 200;
let snakeY = 200;
let dx = 0;
let dy = 0;
let gameOver = false; // 新增一個「遊戲結束」的狀態開關

// --- Keyboard Input Listener ---
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    // 如果遊戲已經結束，就直接忽略任何按鍵輸入
    if (gameOver) return;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;

    if (keyPressed === LEFT_KEY) {
        dx = -tileSize;
        dy = 0;
    }
    if (keyPressed === UP_KEY) {
        dx = 0;
        dy = -tileSize;
    }
    if (keyPressed === RIGHT_KEY) {
        dx = tileSize;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY) {
        dx = 0;
        dy = tileSize;
    }
}

// --- Game Loop ---
function gameLoop() {
    // 如果遊戲結束開關被打開，就執行遊戲結束的畫面然後停止
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '50px Verdana';
        ctx.fillText('Game Over!', gameCanvas.width / 6.5, gameCanvas.height / 2);
        return; // 使用 return 來停止遊戲迴圈的後續執行
    }

    // 更新蛇頭的位置
    snakeX += dx;
    snakeY += dy;

    // *** 新增的碰撞偵測邏輯 ***
    // 檢查蛇頭是否撞到左右牆壁
    if (snakeX < 0 || snakeX >= gameCanvas.width) {
        gameOver = true; // 打開遊戲結束的開關
    }
    // 檢查蛇頭是否撞到上下牆壁
    if (snakeY < 0 || snakeY >= gameCanvas.height) {
        gameOver = true; // 打開遊戲結束的開關
    }
    
    // 清除整個畫布
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    // 重繪蛇頭
    ctx.fillStyle = 'lime';
    ctx.fillRect(snakeX, snakeY, tileSize, tileSize);
}

// --- 啟動遊戲 ---
setInterval(gameLoop, 100);