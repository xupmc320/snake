// 取得 HTML 中的 canvas 元素
const gameCanvas = document.getElementById('gameCanvas');
// 取得 canvas 的 2D 繪圖環境，未來所有繪圖操作都在 ctx 上進行
const ctx = gameCanvas.getContext('2d');

// 設定蛇的初始位置
let snakeX = 200;
let snakeY = 200;

// 設定方塊的大小
let tileSize = 20;

// 繪製蛇的頭部
ctx.fillStyle = 'lime'; // 設定填滿顏色為萊姆綠
ctx.fillRect(snakeX, snakeY, tileSize, tileSize); // 在 (x,y) 座標繪製一個方塊