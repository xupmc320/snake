// --- Canvas Setup ---
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// --- Game Settings ---
const tileSize = 20;
let score = 0;
let gameOver = false;

// 蛇現在是一個陣列，包含數個有 x,y 座標的物件
// 我們讓蛇一開始就有三節身體
let snake = [
  {x: 200, y: 200}, // 蛇頭
  {x: 180, y: 200}, // 身體
  {x: 160, y: 200}  // 蛇尾
];

// 蛇的移動方向，讓它一開始就往右走
let dx = tileSize;
let dy = 0;

// 食物的座標
let foodX;
let foodY;

// 遊戲主迴圈，但這次我們用 setTimeout 來控制，而不是 setInterval
main();
// 產生第一顆食物
createFood();

// --- 遊戲主要函式 ---

// 這是遊戲引擎的核心
function main() {
    // 如果遊戲結束，就顯示訊息並停止一切
    if (didGameEnd()) {
        ctx.fillStyle = 'white';
        ctx.font = '50px Verdana';
        ctx.fillText('Game Over!', gameCanvas.width / 6.5, gameCanvas.height / 2);
        return;
    }
    // 使用 setTimeout 來不斷循環呼叫 main 函式，形成遊戲迴圈
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        // 再次呼叫 main 函式，準備下一幀的畫面
        main();
    }, 100);
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
    // 產生一個在畫布範圍內的隨機座標
    // 我們要確保食物的座標會在網格上，所以要乘以 tileSize
    foodX = Math.floor(Math.random() * (gameCanvas.width / tileSize)) * tileSize;
    foodY = Math.floor(Math.random() * (gameCanvas.height / tileSize)) * tileSize;
}

function moveSnake() {
    // 根據目前的方向(dx, dy)來計算出蛇頭的新位置
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    // 將新的頭部加到蛇身體陣列的最前面
    snake.unshift(head);

    // 檢查蛇頭是否吃到食物
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        // 如果吃到食物，分數+10
        score += 10;
        scoreDisplay.textContent = '分數: ' + score;
        // 產生一顆新的食物
        createFood();
    } else {
        // 如果沒吃到食物，就將蛇的尾巴砍掉一節
        // 這樣一加一減，就達成了蛇往前移動的效果
        snake.pop();
    }
}

function drawSnake() {
    // 遍歷 snake 陣列中的每一個節點，並把它畫出來
    snake.forEach(snakePart => {
        ctx.fillStyle = 'lime';
        ctx.fillRect(snakePart.x, snakePart.y, tileSize, tileSize);
    });
}

function didGameEnd() {
    // 檢查蛇是否撞到自己的身體
    // 我們從第二節身體(索引為1)開始檢查
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    // 檢查蛇是否撞到牆壁
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= gameCanvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= gameCanvas.height;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

// --- 鍵盤監聽 ---
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    // 避免蛇原地掉頭（例如正在往右走時，不能直接按左鍵）
    const goingUp = dy === -tileSize;
    const goingDown = dy === tileSize;
    const goingRight = dx === tileSize;
    const goingLeft = dx === -tileSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -tileSize; dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0; dy = -tileSize;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = tileSize; dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0; dy = tileSize;
    }
}