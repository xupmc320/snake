// --- Canvas Setup (不變) ---
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

// --- Game Settings (新增了方向與速度) ---
const tileSize = 20; // 方塊的大小 (蛇的每一節身體，也是移動的單位)

let snakeX = 200; // 蛇頭的起始 X 座標
let snakeY = 200; // 蛇頭的起始 Y 座標

// dx, dy 代表蛇在 X 和 Y 軸上每一幀(frame)的移動距離
let dx = 0; // 水平方向速度
let dy = 0; // 垂直方向速度


// --- 主遊戲迴圈 (Game Loop) ---
// 這個函式會透過 setInterval 不斷重複執行
function gameLoop() {
    // 1. 更新蛇頭的位置
    snakeX += dx;
    snakeY += dy;

    // 2. 清除整個畫布 (用黑色覆蓋)
    // 如果不清空，蛇移動時會留下殘影
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    // 3. 在新位置上重繪蛇頭
    ctx.fillStyle = 'lime';
    ctx.fillRect(snakeX, snakeY, tileSize, tileSize);
}

// --- 鍵盤監聽 ---
// 為整個網頁加上一個事件監聽器，專門聽"keydown"(按下按鍵)事件
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;

    // 根據按下的按鍵，改變蛇的移動方向
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


// --- 啟動遊戲 ---
// setInterval 會每隔 100 毫秒(ms)，就去執行一次 gameLoop 函式
// 1000ms = 1秒，所以這裡是每秒執行10次，也就是遊戲速度
setInterval(gameLoop, 100);